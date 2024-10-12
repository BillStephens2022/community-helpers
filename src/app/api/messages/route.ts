import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../_lib/dbMongoose";
import Message from "../../_models/Message";
import User from "../../_models/User";
import { MessageBody } from "../../_lib/types"



export async function POST(req: NextRequest) {
  await dbConnect(); // Ensure the database is connected

  try {
    const { from, to, messageSubject, messageText }: MessageBody = await req.json();

    // Validate required fields
    if (!from || !to || !messageSubject || !messageText) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Ensure sender and receiver are different
    if (from === to) {
      return NextResponse.json(
        { message: "Sender and receiver cannot be the same user." },
        { status: 400 }
      );
    }

    // Create a new message
    const newMessage = await Message.create({
      from,
      to,
      messageSubject,
      messageText,
    });

    // Update sender's and receiver's message references
    await User.findByIdAndUpdate(from, { $push: { sentMessages: newMessage._id } });
    await User.findByIdAndUpdate(to, { $push: { receivedMessages: newMessage._id } });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
