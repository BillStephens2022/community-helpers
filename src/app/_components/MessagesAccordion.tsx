import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { Accordion, AccordionItem } from "@mantine/core";
import { FaRegTrashCan, FaReply } from "react-icons/fa6";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MessageBody } from "../_lib/types";
import { userState } from "../_atoms/userAtom";
import { deleteMessage } from "../_utils/api/messages";
import Modal from "./ui/Modal";
import MessageReplyForm from "./forms/MessageReplyForm";
import styles from "./messagesAccordion.module.css";
import ContractForm from "./forms/ContractForm";

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
  const { data: session } = useSession();
  const [user, setUser] = useRecoilState(userState);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [activeMessage, setActiveMessage] = useState<MessageBody | null>(null);
  const [recipientProfileImage, setRecipientProfileImage] = useState<
    string | null
  >(null);

  const loggedInUserId = session?.user?.id;
  const loggedInUsername = session?.user?.name;

  const openReplyModal = (message: MessageBody) => {
    setActiveMessage(message);
    // Get the relevant user (from or to) based on the message direction
    const recipient =
      messageDirection === "Received" ? message.from : message.to;

    // Set the profile image from the recipient's data
    setRecipientProfileImage(recipient.profileImage || null);

    setIsReplyModalOpen(true);
  };

  const closeReplyModal = () => {
    setIsReplyModalOpen(false);
    setActiveMessage(null);
    setRecipientProfileImage(null);
  };

  const openContractModal = (message: MessageBody) => {
    setActiveMessage(message);
    // Get the relevant user (from or to) based on the message direction
    const recipient =
      messageDirection === "Received" ? message.from : message.to;
    // Set the profile image from the recipient's data
    setRecipientProfileImage(recipient.profileImage || null);
    setIsContractModalOpen(true);
  };

  const closeContractModal = () => {
    setIsContractModalOpen(false);
    setActiveMessage(null);
    setRecipientProfileImage(null);
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

  const handleReplySuccess = (reply: MessageBody) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      const replyWithRecipient = {
        ...reply,
        to: activeMessage?.from || reply.to, // Use original sender as recipient
        from: activeMessage?.to || reply.from, // Use original recipient as sender
      };

      const updatedSentMessages = [
        ...(prevUser.sentMessages || []),
        replyWithRecipient,
      ];

      return {
        ...prevUser,
        sentMessages: updatedSentMessages,
      };
    });
  };

  const messages =
    messageDirection === "Received"
      ? user?.receivedMessages
      : user?.sentMessages;

  return (
    <div className={styles.messages_container}>
      <h2 className={styles.messages_title}>
        {messageDirection} Messages ({messages?.length || 0})
      </h2>
      {messages && messages.length > 0 ? (
        <div className={styles.accordion}>
          <Accordion
            bg="transparent"
            styles={{
              chevron: {
                color: "white", // Change this to your desired color
              },
            }}
          >
            {/* Header Labels */}
            <div className={styles.accordion_labels}>
              <div className={styles.header_row1}>
                <span className={styles.header_date}>Date</span>
                <span className={styles.message_direction}>{messageDirection === "Received" ? "From" : "To"}</span>
              </div>
              <div className={styles.header_row2}>
                <span className={styles.header_subject}>Subject</span>
              </div>
            </div>
            {messages.map((message) => (
              <AccordionItem
                key={message._id}
                value={message._id}
                className={styles.accordion_item}
              >
                <Accordion.Control>
                  <div className={styles.accordion_header}>
                    <div className={styles.row1}>
                      <span className={styles.date}>
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                      <span className={styles.sender}>
                        {messageDirection === "Received"
                          ? `${message.from.firstName} ${message.from.lastName}`
                          : `${message.to.firstName} ${message.to.lastName}`}
                      </span>
                    </div>
                    <div className={styles.row2}>
                      <span className={styles.subject}>
                        {message.messageSubject}
                      </span>
                    </div>
                  </div>
                </Accordion.Control>
                <Accordion.Panel>
                  <p className={styles.message_text}>{message.messageText}</p>
                  <div className={styles.action_div}>
                    <FaReply
                      className={styles.reply_icon}
                      onClick={() => openReplyModal(message)}
                    />
                    <FaRegTrashCan
                      onClick={() => handleDeleteMessage(message._id)}
                      className={styles.trash_icon}
                    />
                    <IoDocumentTextOutline
                      className={styles.document_icon}
                      onClick={() => openContractModal(message)}
                    />
                  </div>
                </Accordion.Panel>
              </AccordionItem>
            ))}
          </Accordion>
          {isReplyModalOpen && activeMessage && (
            <Modal
              onClose={closeReplyModal}
              title={`Reply to ${activeMessage.from.firstName}`}
              profileImage={recipientProfileImage}
              content={
                <MessageReplyForm
                  parentMessageId={activeMessage._id}
                  userId={userId}
                  onClose={closeReplyModal}
                  onReplySuccess={handleReplySuccess}
                />
              }
            />
          )}
          {isContractModalOpen && activeMessage && (
            <Modal
              onClose={closeContractModal}
              title={`Create contract with ${
                messageDirection === "Received"
                  ? activeMessage.from.firstName
                  : activeMessage.to.firstName
              }`}
              profileImage={recipientProfileImage}
              content={
                <ContractForm
                  loggedInUserId={loggedInUserId}
                  loggedInUsername={loggedInUsername || ""}
                  closeModal={closeContractModal}
                  clientId={
                    messageDirection === "Received"
                      ? activeMessage.from._id
                      : activeMessage.to._id
                  }
                />
              }
            />
          )}
        </div>
      ) : (
        <p className={styles.no_messages_p}>No messages sent.</p>
      )}
    </div>
  );
};

export default MessagesAccordion;
