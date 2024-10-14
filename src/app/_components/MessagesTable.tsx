import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { messagesState } from "../_atoms/messageAtom";
import { FaRegTrashCan, FaReply } from "react-icons/fa6";
import { MessageBody, User } from "../_lib/types";
import { deleteMessage } from "../_utils/api/messages";
import styles from "./messagesContent.module.css";
import { userState } from "../_atoms/userAtom";

interface MessagesTableProps {
  messages: MessageBody[];
  messageDirection: "Received" | "Sent";
  userId: string;
}

const MessagesTable = ({ messages: initialMessages, messageDirection, userId }: MessagesTableProps) => {
  const [user, setUser] = useRecoilState(userState);
  

  console.log(messageDirection, " Messages :", initialMessages);

  const handleDeleteMessage = async (messageId: string) => {
    // Optimistically remove the message from the UI
    setUser((prevUser) => {
      if (!prevUser) return prevUser; // Handle potential null user

      const updatedMessages = messageDirection === "Received"
        ? prevUser.receivedMessages.filter((msg) => msg._id !== messageId)
        : prevUser.sentMessages.filter((msg) => msg._id !== messageId);

      // Return the updated user with the modified messages
      return {
        ...prevUser,
        [messageDirection === "Received" ? "receivedMessages" : "sentMessages"]: updatedMessages,
      };
    });

    // Call the deleteMessage API
    const { success, error } = await deleteMessage(messageId, userId);

    if (!success) {
      console.error("Failed to delete message:", error);
      alert("Failed to delete message.");

      // Revert the optimistic update if the delete fails
      setUser((prevUser) => {
        if (!prevUser) return prevUser;

        const revertedMessages = messageDirection === "Received"
          ? [...prevUser.receivedMessages, initialMessages.find(msg => msg._id === messageId)!]
          : [...prevUser.sentMessages, initialMessages.find(msg => msg._id === messageId)!];

        // Return the updated user with the reverted messages
        return {
          ...prevUser,
          [messageDirection === "Received" ? "receivedMessages" : "sentMessages"]: revertedMessages,
        };
      });
    }
  };

  const messages = messageDirection === "Received" ? user?.receivedMessages : user?.sentMessages;

  return (
    <>
      <h2 className={styles.profile_table_title}>
        {messageDirection} Messages
      </h2>
      {messages && messages.length > 0 ? (
        <table className={styles.messageTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>{messageDirection === "Received" ? "From" : "To"}</th>
              <th>Subject</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message._id}>
                <td>{new Date(message.createdAt).toLocaleDateString()}</td>
                <td>
                  {messageDirection === "Received" ? (
                    <>
                      {message.from.firstName} {message.from.lastName}
                    </>
                  ) : (
                    <>
                      {message.to.firstName} {message.to.lastName}
                    </>
                  )}
                </td>
                <td>{message.messageSubject}</td>
                <td>
                  <div className={styles.action_div}>
                    <FaRegTrashCan
                      onClick={() => handleDeleteMessage(message._id)}
                      className={styles.trash_icon}
                    />
                    <FaReply className={styles.reply_icon} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.no_messages_p}>No messages sent.</p>
      )}
    </>
  );
};

export default MessagesTable;
