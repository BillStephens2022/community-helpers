import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "../../../_lib/auth";
import { dbConnect } from "../../../_lib/dbMongoose";
import User from "../../../_models/User";


console.log('Signup route hit!');
dbConnect();
console.log('Model imported in signup.ts!');

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const { email, password, firstName, lastName } = data;

  if (!email || !password || password.trim().length < 7) {
    return NextResponse.json({
      message: "Invalid input - password should be at least 7 characters long.",
    }, { status: 422 });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOneAndUpdate({ email }, {}, { new: true });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists." }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    // Create a new user instance using the User model
    const newUser = new User({ email, password: hashedPassword, firstName, lastName });

    // Save the new user to the database
    await newUser.save();

    return NextResponse.json({ message: "User created successfully." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}