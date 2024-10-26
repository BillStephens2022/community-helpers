
  export const createReply = async (
    parentMessageId: string, 
    from: string, 
    messageText: string
  ) => {
    try {
      const res = await fetch(`/api/messages/${parentMessageId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, messageText }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create reply.");
      }
  
      const reply = await res.json();
      return { success: true, reply };
    } catch (error) {
      console.error("Error creating reply:", error);
      return { success: false, error: (error as Error).message };
    }
  };

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