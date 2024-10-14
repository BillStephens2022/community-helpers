import { MessageBody } from "../_lib/types";
import styles from "./messagesContent.module.css";

interface MessagesTableProps {
  messages: MessageBody[];
  messageDirection: "Received" | "Sent";
}

const MessagesTable = ({ messages, messageDirection }: MessagesTableProps) => {
  console.log(messageDirection, " Messages :", messages);

  return (
    <>
      <h2 className={styles.profile_table_title_received}>
        {messageDirection} Messages
      </h2>
      {messages && messages.length > 0 ? (
        <table className={styles.messageTable_sent}>
          <thead>
            <tr>
              <th>Date</th>
              <th>{messageDirection === "Received" ? "From" : "To"}</th>
              <th>Subject</th>
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
