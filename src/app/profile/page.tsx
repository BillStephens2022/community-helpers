"use client";

import { useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { useProfileData } from "../_utils/hooks/useProfileData";
import { userState } from "../_atoms/userAtom";
import Loader from "../_components/ui/Loader";
import styles from "./profile.module.css";
import ProfileContent from "../_components/profileContent";

export default function Profile() {
  const [view, setView] = useState("profile");
  const user = useRecoilValue(userState);
  const { loading } = useProfileData();

  if (!user) return <div>Access Denied</div>;

  if (loading) return <Loader />;

  const renderSentMessages = () => {
    if (user.sentMessages && user.sentMessages.length > 0) {
      return (
        <table className={styles.messageTable_sent}>
          <thead>
            <tr>
              <th>Date</th>
              <th>From</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            {user.sentMessages.map((msg) => (
              <tr key={msg._id}>
                <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                <td>
                  {msg.to.firstName} {msg.to.lastName}
                </td>
                <td>{msg.messageSubject}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      return <p className={styles.no_messages_p}>No messages sent.</p>;
    }
  };

  const renderReceivedMessages = () => {
    if (user.receivedMessages && user.receivedMessages.length > 0) {
      return (
        <table className={styles.messageTable_received}>
          <thead>
            <tr>
              <th>Date</th>
              <th>From</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            {user.receivedMessages.map((msg) => (
              <tr key={msg._id}>
                <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                <td>
                  {msg.from.firstName} {msg.from.lastName}
                </td>
                <td>{msg.messageSubject}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      return <p className={styles.no_messages_p}>No messages received.</p>;
    }
  };

  return (
    <div className={styles.profile_page}>
      <div>
        <button onClick={() => setView("profile")}>Profile</button>
        <button onClick={() => setView("messages")}>Messages</button>
      </div>
      {view === "profile" && <ProfileContent user={user} />}
      {view === "messages" && (
        <>
          <h2 className={styles.profile_table_title_received}>
            Received Messages
          </h2>
          {renderReceivedMessages()}
          <h2 className={styles.profile_table_title_sent}>Sent Messages</h2>
          {renderSentMessages()}
        </>
      )}
    </div>
  );
}
