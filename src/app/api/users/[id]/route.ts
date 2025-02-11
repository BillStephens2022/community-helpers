import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../_lib/dbMongoose";
import User from "../../../_models/User";


export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await dbConnect();
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
      })
      .populate({
        path: 'reviews',
        populate: { path: 'reviewer', select: '_id firstName lastName email profileImage' } // Populate the 'reviewer' field of reviews
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
        services: user.services || [],
        reviews: user.reviews || [],
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await dbConnect();
    
    // Parse request body to get update fields
    const body = await req.json();
    
    // Find the user
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Add new services
    if (body.addService) {
      const service = body.addService;
      user.services.push(service);
    }

     // Remove service by name (single service string)
     if (body.removeService) {
      user.services = user.services.filter(
        (service: { service: string }) => service.service !== body.removeService
      );
    }

    // Add review
    if (body.addReview) {
      console.log("Adding review to user:", body.addReview);
      const review = body.addReview;
      user.reviews.push(review);
    }

    // Update other fields dynamically (excluding `addService` & `removeService`)
    Object.keys(body).forEach((key) => {
      if (key !== "addService" && key !== "removeService" && key !== "addReview") {
        user[key] = body[key];
      }
    });

    // Save the updated user
    await user.save();

    return NextResponse.json(
      { message: "User updated successfully", user },
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
