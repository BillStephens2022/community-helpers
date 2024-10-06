import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../_lib/dbMongoose";
import User from "../../../_models/User";

console.log("Get user route hit!");

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("params: ", params);
  const { id } = params;

  try {
    await dbConnect();
    console.log("getting userId: ", id);
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        skillset: user.skillset,
        skills: user.skills,
        aboutText: user.aboutText,
        isWorker: user.isWorker
      },
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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("Update user route hit!");
  const { id } = params;

  try {
    await dbConnect();

    // Parse the request body to get updated user data
    const updatedData = await req.json();

    // Find the user by ID and update their information
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the update against the model
    });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: updatedUser,
      },
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
