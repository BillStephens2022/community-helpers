import { NextResponse } from "next/server";
import { dbConnect } from "../../_lib/dbMongoose";
import User from "../../_models/User";

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find({})
    .populate({
      path: 'reviews.reviewer', // Directly populating the nested field
      select: '_id firstName lastName email profileImage'
    });
    if (users.length === 0) {
      return NextResponse.json({ message: "No users found." }, { status: 404 });
    }
    return NextResponse.json(
      { users },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
