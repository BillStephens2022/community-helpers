import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../_lib/dbMongoose";
import Message from "../../../_models/Message";
import User from "../../../_models/User";

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
