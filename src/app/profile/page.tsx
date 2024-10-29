"use client";

import { useState, useEffect } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { useProfileData } from "../_utils/hooks/useProfileData";
import { userState, usersState } from "../_atoms/userAtom";
import Loader from "../_components/ui/Loader";
import ProfileContent from "../_components/ProfileContent";
import MessagesAccordion from "../_components/MessagesAccordion";
import ContractContent from "../_components/ContractsContent";
import { fetchUsers } from "../_utils/api/users";
import styles from "./profile.module.css";

export default function Profile() {
  const [view, setView] = useState("profile");
  const [, setUsers] = useRecoilState(usersState);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const user = useRecoilValue(userState);
  const { loading } = useProfileData(); 

  useEffect(() => {
    const getUsers = async () => {
      setLoadingUsers(true);
      try {
        const data = await fetchUsers();
        console.log("data: ", data);
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    getUsers();
  }, [setUsers]);

  if (loading || loadingUsers) return <Loader />;

  if (!user) return <div>Access Denied</div>;

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
          Messages <span className={styles.count_span}>{(user.sentMessages?.length + user.receivedMessages?.length) || 0}</span>
        </button>
        <button
          className={`${styles.view_button} ${
            view === "contracts" ? styles.active : ""
          }`}
          onClick={() => setView("contracts")}
        >
          Contracts <span className={styles.count_span}>{user.contracts?.length || 0}</span>
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
