import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../_lib/dbMongoose";
import User from "../../../../_models/User";

console.log("Get user contracts route hit!");

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await dbConnect();
    console.log("getting contracts for userId: ", id);
    const user = await User.findById(id)
      .populate({
        path: "contracts",
        model: "Contract"
      })
      .populate({
        path: "contracts",
        model: "Contract",
        populate: [
          {
            path: "client",
            model: User,
            select: "_id firstName lastName email profileImage",
          },
          {
            path: "worker",
            model: User,
            select: "_id firstName lastName email profileImage",
          },
        ],
      });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user.contracts, { status: 200 });
  } catch (error) {
    console.error(error);
    console.error("Error fetching user contracts:", error);
    return NextResponse.json({ error: "Failed to fetch user contracts" }, { status: 500 });
  }
}