import { useState } from "react";
import { useRecoilState } from "recoil";
import { Accordion, AccordionItem } from "@mantine/core";
import { FaRegTrashCan, FaReply } from "react-icons/fa6";
import { MessageBody, User } from "../_lib/types";
import { userState } from "../_atoms/userAtom";
import { deleteMessage } from "../_utils/api/messages";
import Modal from "./ui/Modal";
import styles from "./messagesAccordion.module.css";


interface MessagesAccordionProps {
  messages: MessageBody[];
  messageDirection: "Received" | "Sent";
  userId: string;
}

const MessagesAccordion = ({
  messages: initialMessages,
  messageDirection,
  userId,
}: MessagesAccordionProps) => {
  const [user, setUser] = useRecoilState(userState);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteMessage = async (messageId: string) => {
    // Optimistically remove the message from the UI
    setUser((prevUser) => {
      if (!prevUser) return prevUser; // Handle potential null user

      const updatedMessages =
        messageDirection === "Received"
          ? prevUser.receivedMessages.filter((msg) => msg._id !== messageId)
          : prevUser.sentMessages.filter((msg) => msg._id !== messageId);

      // Return the updated user with the modified messages
      return {
        ...prevUser,
        [messageDirection === "Received" ? "receivedMessages" : "sentMessages"]:
          updatedMessages,
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

        const revertedMessages =
          messageDirection === "Received"
            ? [
                ...prevUser.receivedMessages,
                initialMessages.find((msg) => msg._id === messageId)!,
              ]
            : [
                ...prevUser.sentMessages,
                initialMessages.find((msg) => msg._id === messageId)!,
              ];

        // Return the updated user with the reverted messages
        return {
          ...prevUser,
          [messageDirection === "Received"
            ? "receivedMessages"
            : "sentMessages"]: revertedMessages,
        };
      });
    }
  };

  const messages =
    messageDirection === "Received"
      ? user?.receivedMessages
      : user?.sentMessages;

  return (
    <>
      <h2 className={styles.profile_accordion_title}>
        {messageDirection} Messages
      </h2>
      {messages && messages.length > 0 ? (
        <div className={styles.accordion}>
          <Accordion bg="transparent">
            {/* Column Labels */}
            <div className={styles.accordion_labels}>
              <span>Date</span>
              <span>{messageDirection === "Received" ? "From" : "To"}</span>
              <span>Subject</span>
              <span>Actions</span>
            </div>
            {messages.map((message) => (
              <AccordionItem key={message._id} value={message._id}>
                {/* <div className={styles.accordion_header}> */}
                <Accordion.Control>
                  <div className={styles.accordion_header} style={{color: "whitesmoke", fontWeight: "700"}}>
                    <span>
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      {messageDirection === "Received"
                        ? `${message.from.firstName} ${message.from.lastName}`
                        : `${message.to.firstName} ${message.to.lastName}`}
                    </span>
                    <span>{message.messageSubject}</span>
                    <div className={styles.action_div}>
                      <FaRegTrashCan
                        onClick={() => handleDeleteMessage(message._id)}
                        className={styles.trash_icon}
                      />
                      <FaReply className={styles.reply_icon} onClick={() => setIsModalOpen(true)}/>
                    </div>
                  </div>
                </Accordion.Control>
                {/* </div> */}
                <div className={styles.accordion_panel}>
                  <Accordion.Panel>
                    <p>{message.messageText}</p>
                  </Accordion.Panel>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
          {isModalOpen && (
            <Modal onClose={closeModal} title="Reply to..." content={<p>Replying to message...</p>} />
          )}
        </div>
      ) : (
        <p className={styles.no_messages_p}>No messages sent.</p>
      )}
    </>
  );
};

export default MessagesAccordion;
