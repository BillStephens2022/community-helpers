export const deleteMessage = async (messageId: string, userId: string) => {
  try {
    const res = await fetch(`/api/messages/${messageId}`, {
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
