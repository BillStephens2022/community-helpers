import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../_lib/dbMongoose";
import User from "../../../_models/User";
import Contract from "../../../_models/Contract";

// Update a Contract
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    console.log("Update contract route hit!");
    const { id } = params;
  
    try {
      await dbConnect();
  
      // Parse the request body to get updated user data
      const updatedData = await req.json();
  
      // Find the user by ID and update their information
      const updatedContract = await Contract.findByIdAndUpdate(id, { ...updatedData }, {
        new: true, // Return the updated document
        runValidators: true, // Validate the update against the model
      });
  
      if (!updatedContract) {
        return NextResponse.json({ message: "Contract not found" }, { status: 404 });
      }
  
      return NextResponse.json(
        {
          message: "Contract updated successfully",
          user: updatedContract,
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
  
  // Delete a Contract - can only be performed by Worker while in Draft status
  export async function DELETE(req: NextRequest, { params } : { params: { id: string }} ) {
  const { id: contractId } = params; // Contract ID from URL
  const { userId } = await req.json(); // User ID from request body (who is deleting the contract)

  try {
    await dbConnect();

    // Fetch the contract to ensure it exists
    const contract = await Contract.findById(contractId);
    if (!contract) {
      return NextResponse.json({ message: "Contract not found" }, { status: 404 });
    }

    if (contract.status !== "Draft - Awaiting Client Approval") {
      return NextResponse.json({ message: "Can only delete Draft contracts"})
    }

    // Check if the user is the worker on the contract
    const isWorker = contract.worker.toString() === userId;

    if (!isWorker) {
      return NextResponse.json(
        { message: "Not authorized - only the worker is authorized to delete this contract." },
        { status: 403 }
      );
    }

    // Remove the contract from the worker's contracts array
    const workerUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          contracts: contractId,
        },
      },
      { new: true }
    );

    
    // Remove the contract from the client's contracts array
    const clientUser = await User.findByIdAndUpdate(
      contract.client._id,
      {
        $pull: {
          contracts: contractId,
        },
      },
      { new: true }
    );


    if (!workerUser) {
      return NextResponse.json({ message: "Worker not found" }, { status: 404 });
    }

    if (!clientUser) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }

    await Contract.findByIdAndDelete(contractId);
    
    return NextResponse.json(
      { message: "Contract deleted successfully." },
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