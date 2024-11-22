// utils/api/contracts.ts

// function to create a new contract
import { ContractBody } from "../../_lib/types";

interface CreateContractData {
  worker: string;
  client: string;
  jobCategory: string;
  jobDescription: string;
  feeType: string;
  hourlyRate?: number;
  hours?: number;
  fixedRate?: number;
  amountDue: number;
  additionalNotes?: string;
  status: string;
}

export const createContract = async (
  contractData: CreateContractData
): Promise<ContractBody> => {
  const response = await fetch(`/api/contracts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contractData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      JSON.stringify(
        Object.fromEntries(
          Object.entries(errorData).map(([key, value]) => [
            key,
            Array.isArray(value) ? value.join(", ") : String(value),
          ])
        )
      )
    );
  }

  return response.json();
};

export async function updateContract(contractId: string, updatedData: CreateContractData) {
  try {
    const response = await fetch(`/api/contracts/${contractId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update contract');
    }

    const result = await response.json();

    return result.user;
  } catch (err) {
    const error = err as Error;
    console.error("An error occurred while updating the contract:", error);
    throw error;
  }
}

// function to update the contract status
export const updateContractStatus = async (
  contractId: string,
  newStatus: string
): Promise<void> => {
  const response = await fetch(`/api/contracts/${contractId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!response.ok) {
    throw new Error("Failed to update the contract status.");
  }
};

// function to delete a contract
export const deleteContract = async (contractId: string, userId?: string) => {

  try {
    const res = await fetch(`/api/contracts/${contractId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete message.");
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting message:", error);
    return { success: false, error: (error as Error).message };
  }
};

export const updateRejectText = async (contractId: string, rejectionText: string) => {
  try {
    const response = await fetch(`/api/contracts/${contractId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rejectionText, status: "Rejected by Client - Awaiting Revision" }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update contract.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating contract:", error);
    throw error;
  }
};

// Fetch all users
export const fetchContracts = async () => {
  const res = await fetch("/api/contracts");
  if (!res.ok) {
    throw new Error("Failed to fetch contracts.");
  }
  const data = await res.json();
  return data.contracts;
};

