"use client";

import { useState } from "react";
import { useRecoilValue } from "recoil";
import { useProfileData } from "../_utils/hooks/useProfileData";
import { userState } from "../_atoms/userAtom";
import Loader from "../_components/ui/Loader";
import ProfileContent from "../_components/ProfileContent";
import MessagesContent from "../_components/MessagesContent";
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
      </div>
      {view === "profile" && <ProfileContent user={user} />}
      {view === "messages" && <MessagesContent user={user} />}
    </div>
  );
}
