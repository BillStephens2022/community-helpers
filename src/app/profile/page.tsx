"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { userState } from '../_atoms/userAtom';
import styles from "./profile.module.css";

export default function Profile() {
  
  const { data: session } = useSession();
  const setUser = useSetRecoilState(userState);
  const user = useRecoilValue(userState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          const userId = session?.user?.id; 
          const res = await fetch(`/api/users/${userId}`);
          if (!res.ok) {
            throw new Error("Failed to fetch user data.");
          }

          const data = await res.json();
          console.log("data: ", data);

          // Update Recoil state with user data
          setUser({
            firstName: data.firstName,
            lastName: data.lastName,
            skills: data.skills,
          });
          setLoading(false);  // Set loading to false once data is fetched
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);  // Set loading to false even in case of error
        }
      }
    };

    fetchUserData();
  }, [session, setUser]);
  
  if (!session) {
    return <div>Access Denied</div>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.profile_page}>
     <h1 className={styles.profile_h1}>Profile</h1>
     <p className={styles.profile_p}>Name: {user?.firstName} {user?.lastName}</p>
     <ul className={styles.profile_ul}>
     {user?.skills?.map((skill, index) => (
          <li key={index}>{skill}</li>  // Add key to each list item
        ))}
      </ul>
    </div>
  );
}