import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../_lib/dbMongoose";
import Contract from "../../_models/Contract";
import User from "../../_models/User";
import { ContractBody } from "../../_lib/types";

export async function POST(req: NextRequest) {
  await dbConnect(); // Ensure the database is connected
  console.log("Create contract route hit!");
  try {
    const {
      worker, 
      client, 
      jobCategory, 
      jobDescription, 
      feeType, 
      hourlyRate, 
      hours, 
      fixedRate, 
      amountDue, 
      additionalNotes,
      status
    }: ContractBody = await req.json();
    console.log("Request body: ", {
      worker,
      client,
      jobCategory,
      jobDescription,
      amountDue,
    });
    // Validate required fields
    if (!client || !worker || !jobCategory || !jobDescription || !amountDue) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Ensure client and worker are different
    if (client === worker) {
      return NextResponse.json(
        { message: "Client and Worker cannot be the same." },
        { status: 400 }
      );
    }

    // Create a new contract
    const newContract = await Contract.create({
      worker,
      client,
      jobCategory,
      jobDescription,
      feeType,
      hourlyRate: hourlyRate || undefined, 
      hours: hours || undefined,          
      fixedRate: fixedRate || undefined,   
      amountDue,
      additionalNotes: additionalNotes || "", 
      status
    });

    // Update both client's and worker's contract references
    await User.findByIdAndUpdate(worker, {
      $push: { contracts: newContract._id },
    });
    await User.findByIdAndUpdate(client, {
      $push: { contracts: newContract._id },
    });

    return NextResponse.json(newContract, { status: 201 });
  } catch (error) {
    console.error("Error creating contract:", error);
    return NextResponse.json(
      { message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
