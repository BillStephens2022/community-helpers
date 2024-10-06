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
        skills: user.skills,
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
