// api/messages.ts

// function to send a message
// _lib/api/messageApi.ts

import { MessageBody } from "../../_lib/types";

export const sendMessage = async (
  fromUserId: string,
  toUserId: string,
  messageSubject: string,
  messageText: string
): Promise<MessageBody> => {
  try {
    const response = await fetch(`/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromUserId,
        to: toUserId,
        messageSubject,
        messageText,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send message.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};


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
