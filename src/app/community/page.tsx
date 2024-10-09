"use client"

import { useState, useEffect } from "react";
import { fetchUsers } from "../_utils/api/users";
import { User } from "../_lib/types";
import Loader from "../_components/ui/Loader";
import ProfileCard from "../_components/ProfileCard";
import styles from "./page.module.css"

export default function Community() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchUsers(); 
        setUsers(data); 
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false); 
      }
    };

    getUsers();
  }, []);

  if (loading) {
    return <Loader />; 
  }

  return (
      <div className={styles.community_page}>
        <h1>Community</h1>
        <p>This is the community page.</p>
        <div className={styles.users_div}>
          {users.map(user => ( 
            <div key={user.id}><ProfileCard user={user} isProfilePage={false} /></div>
    
          ))}
          </div>
      </div>
    );
  }