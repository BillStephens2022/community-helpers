"use client";

import { useState } from "react";
import { useRecoilValue } from "recoil";
import { userState, userContractsState, usersLoadingState } from "../_atoms/userAtom";
import Loader from "../_components/ui/Loader";
import ProfileContent from "../_components/ProfileContent";
import MessagesAccordion from "../_components/MessagesAccordion";
import ContractContent from "../_components/ContractsContent";
import styles from "./profile.module.css";
import ReviewsList from "../_components/ReviewsList";


export default function Profile() {
  const [view, setView] = useState("profile");
  const user = useRecoilValue(userState);
  const contracts = useRecoilValue(userContractsState);
  const loading = useRecoilValue(usersLoadingState);
  
  if (loading) return <Loader />;

  if (!user) return <div>Access Denied</div>;

  console.log("user from Profile page: ", user);

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
          Contracts <span className={styles.count_span}>{contracts.length || 0}</span>
        </button>
        <button
          className={`${styles.view_button} ${
            view === "reviews" ? styles.active : ""
          }`}
          onClick={() => setView("reviews")}
        >
          Reviews <span className={styles.count_span}>{(user.reviews?.length) || 0}</span>
        </button>
      </div>
      {view === "profile" && <ProfileContent user={user} />}
      {view === "messages" && (
        <>
          <MessagesAccordion messages={user.receivedMessages || []} messageDirection="Received" userId={user._id} />
          <MessagesAccordion messages={user.sentMessages || []} messageDirection="Sent" userId={user._id} />
        </>
      )}
      {view === "contracts" && <ContractContent />}
      {view === "reviews" && <ReviewsList reviews = {user.reviews || []} neighborName={user.firstName} />}
    </div>
  );
}
