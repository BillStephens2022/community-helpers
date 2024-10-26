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
