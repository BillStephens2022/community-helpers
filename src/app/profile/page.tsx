"use client";

import { useState } from "react";
import { useRecoilValue } from "recoil";
import { useProfileData } from "../_utils/hooks/useProfileData";
import { userState } from "../_atoms/userAtom";
import Loader from "../_components/ui/Loader";
import ProfileContent from "../_components/ProfileContent";
import MessagesAccordion from "../_components/MessagesAccordion";
import ContractContent from "../_components/ContractsContent";
import styles from "./profile.module.css";

export default function Profile() {
  const [view, setView] = useState("profile");
  const user = useRecoilValue(userState);
  const { loading } = useProfileData();

  if (!user) return <div>Access Denied</div>;

  if (loading) return <Loader />;

  return (
    <div className={styles.profile_page}>
      <div className={styles.view_button_div}>
        <button
          className={`${styles.view_button} ${
            view === "profile" ? styles.active : ""
          }`}
          onClick={() => setView("profile")}
        >
          Profile
        </button>
        <button
          className={`${styles.view_button} ${
            view === "messages" ? styles.active : ""
          }`}
          onClick={() => setView("messages")}
        >
          Messages
        </button>
        <button
          className={`${styles.view_button} ${
            view === "contracts" ? styles.active : ""
          }`}
          onClick={() => setView("contracts")}
        >
          Contracts
        </button>
      </div>
      {view === "profile" && <ProfileContent user={user} />}
      {view === "messages" && (
        <>
          <MessagesAccordion messages={user.receivedMessages || []} messageDirection="Received" userId={user._id} />
          <MessagesAccordion messages={user.sentMessages || []} messageDirection="Sent" userId={user._id} />
        </>
      )}
      {view === "contracts" && <ContractContent user={user}/>}
    </div>
  );
}
