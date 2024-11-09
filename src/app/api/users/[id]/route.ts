import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../_lib/dbMongoose";
import User from "../../../_models/User";
import { waitForAll } from "recoil";

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
    const user = await User.findById(id)
      .populate({
        path: "receivedMessages",
        populate: { path: "from", select: "_id firstName lastName email profileImage" }, // Populate the 'from' field of messages
      })
      .populate({
        path: "sentMessages",
        populate: { path: "to", select: "_id firstName lastName email profileImage" }, // Populate the 'to' field of messages
      })
      .populate({
        path: "contracts",
        populate: { path: "client", select: "_id firstName lastName email profileImage" }, // Populate the 'client' field of contracts
      })
      .populate({
        path: "contracts",
        populate: { path: "worker", select: "_id firstName lastName email profileImage" }, // Populate the 'worker' field of contracts
      });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        skillset: user.skillset,
        skills: user.skills,
        aboutText: user.aboutText,
        isWorker: user.isWorker,
        profileImage: user.profileImage,
        walletBalance: user.walletBalance,
        receivedMessages: user.receivedMessages || [], 
        sentMessages: user.sentMessages || [], 
        contracts: user.contracts || [],
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await dbConnect();

    // Get the skill from the request body (you could also send it as a query parameter)
    const { skill } = await req.json();

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Remove the skill from the user's skills array
    user.skills = user.skills.filter((s: string) => s !== skill);

    // Save the updated user back to the database
    await user.save();

    return NextResponse.json(
      {
        message: "Skill deleted successfully",
        skills: user.skills, // Optionally return the updated skills array
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
