"use client";

import { useSession } from "next-auth/react";
import styles from "./profile.module.css";

export default function Profile() {
  const { data: session } = useSession();

  if (!session) {
    return <div>Access Denied</div>;
  }

  return (
    <div className={styles.profile_page}>
     <h1 className={styles.profile_h1}>Profile</h1>
     <p className={styles.profile_p}>Name: {session?.user?.name}</p>
     <p className={styles.profile_p}>Skillset: Handyman</p>
    </div>
  );
}