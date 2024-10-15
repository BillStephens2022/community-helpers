import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../_lib/dbMongoose";
import Message from "../../../_models/Message";
import User from "../../../_models/User";
import { MessageBody } from "../../../_lib/types";

export async function DELETE(req: NextRequest, { params } : { params: { id: string }} ) {
  const { id: messageId } = params; // Message ID from URL
  const { userId } = await req.json(); // User ID from request body (who is deleting the message)

  try {
    await dbConnect();

    // Fetch the message to ensure it exists
    const message = await Message.findById(messageId);
    if (!message) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 });
    }

    // Check if the user is either the sender or receiver of the message
    const isSender = message.from.toString() === userId;
    const isReceiver = message.to.toString() === userId;

    if (!isSender && !isReceiver) {
      return NextResponse.json(
        { message: "You are not authorized to delete this message." },
        { status: 403 }
      );
    }

    // Update the message flags based on who is deleting
    if (isSender) message.deletedBySender = true;
    if (isReceiver) message.deletedByReceiver = true;

    await message.save(); // Save the updated message

    // Remove the message from the user's sent/received messages array
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          sentMessages: isSender ? messageId : undefined,
          receivedMessages: isReceiver ? messageId : undefined,
        },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // If both sender and receiver have marked the message as deleted, delete it from the DB
    if (message.deletedBySender && message.deletedByReceiver) {
      await Message.findByIdAndDelete(messageId);
    }

    return NextResponse.json(
      { message: "Message deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

// For Posting a reply to a message
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect(); // Ensure the database is connected

  try {
    const parentMessageId = params.id; // Parent message ID from the route
    const { from, messageText }: Partial<MessageBody> = await req.json(); // Only get necessary fields

    // Validate required fields
    if (!from || !messageText) {
      return NextResponse.json(
        { message: "Both 'from' and 'messageText' are required." },
        { status: 400 }
      );
    }

    // Ensure the parent message exists
    const parentMessage = await Message.findById(parentMessageId);
    if (!parentMessage) {
      return NextResponse.json(
        { message: "Parent message not found." },
        { status: 404 }
      );
    }

    // Use parent message's 'to' and 'messageSubject' for the reply
    const to = parentMessage.from; // Reply to the sender of the original message
    const messageSubject = `Re: ${parentMessage.messageSubject}`; // Optional: prefix with 'Re:'

    // Create the reply message
    const newReply = await Message.create({
      from,
      to,
      messageSubject,
      messageText,
      parentMessage: parentMessageId,
    });

    // Update the parent message to include this reply
    parentMessage.replies.push(newReply._id);
    await parentMessage.save();

    // Update sender's and receiver's message references
    await User.findByIdAndUpdate(from, { $push: { sentMessages: newReply._id } });
    await User.findByIdAndUpdate(to, { $push: { receivedMessages: newReply._id } });

    return NextResponse.json(newReply, { status: 201 });
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json(
      { message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
