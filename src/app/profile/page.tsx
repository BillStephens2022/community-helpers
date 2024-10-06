"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { userState } from "../_atoms/userAtom";
import styles from "./profile.module.css";
import Button from "../_components/ui/Button";
import Modal from "../_components/ui/Modal";
import EditProfileForm from "../_components/forms/editProfileForm";
import { Switch } from "@mantine/core";

export default function Profile() {
  const { data: session } = useSession();
  const setUser = useSetRecoilState(userState);
  const user = useRecoilValue(userState);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
            id: userId || "",
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            skillset: data.skillset,
            skills: data.skills,
            aboutText: data.aboutText,
            isWorker: data.isWorker,
          });
          setLoading(false); // Set loading to false once data is fetched
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false); // Set loading to false even in case of error
        }
      }
    };

    fetchUserData();
  }, [session, setUser]);

  const toggleIsWorker = async () => {
    try {
      const userId = user?.id;
      const updatedIsWorker = !user?.isWorker;

      // API call to update the user profile
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isWorker: updatedIsWorker }),
      });

      if (!res.ok) {
        throw new Error("Failed to update isWorker status.");
      }

      // Update Recoil state with the new value
      setUser((prevUser) => {
        if (!prevUser) return prevUser; // In case prevUser is null, do nothing
        return {
          ...prevUser, // Spread all existing properties
          isWorker: updatedIsWorker, // Update only the isWorker field
        };
      });
    } catch (error) {
      console.error("Error updating isWorker:", error);
    }
  };

  if (!session) {
    return <div>Access Denied</div>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (user) {
    const {
      id,
      firstName,
      lastName,
      email,
      skillset,
      skills,
      aboutText,
      isWorker,
    } = user;

    return (
      <div className={styles.profile_page}>
        <h1 className={styles.profile_h1}>
          {firstName} {lastName}
        </h1>

        <Switch
          size="xl"
          checked={isWorker}
          onChange={toggleIsWorker}
          label="Available for Work?"
          color="#333"
          onLabel="Yes"
          offLabel="No"
          labelPosition="left"
          className={styles.profile_switch}
        />

        <div className={styles.profile_aboutMe}>
          <h2 className={styles.profile_h2}>{skillset}</h2>

          <p className={styles.profile_p}>{aboutText}</p>
        </div>

        <p className={styles.profile_p}>Skills:</p>
        <ul className={styles.profile_ul}>
          {skills?.map((skill, index) => (
            <li key={index}>{skill}</li> // Add key to each list item
          ))}
        </ul>
        <Button type="button" onClick={() => openModal()}>
          Edit Profile
        </Button>

        {isModalOpen && (
          <Modal
            onClose={closeModal}
            title="Edit Profile"
            content={<EditProfileForm closeModal={closeModal} user={user} />}
          />
        )}
      </div>
    );
  }
}
