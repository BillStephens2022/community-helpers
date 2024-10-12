"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { CldUploadWidget } from "next-cloudinary";
import { userState } from "../_atoms/userAtom";
import { Switch } from "@mantine/core";
import ProfileCard from "../_components/ProfileCard";
import Loader from "../_components/ui/Loader";
import {
  fetchUserData,
  updateProfileImage,
  updateIsWorkerStatus,
} from "../_utils/api/users";
import styles from "./profile.module.css";

export default function Profile() {
  const { data: session } = useSession();
  const setUser = useSetRecoilState(userState);
  const user = useRecoilValue(userState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        const userId = session?.user?.id;
        if (userId) {
          try {
            // get the logged in user's data
            const data = await fetchUserData(userId);
            // Update Recoil state with user data
            setUser({
              _id: userId || "",
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              skillset: data.skillset,
              skills: data.skills,
              aboutText: data.aboutText,
              isWorker: data.isWorker,
              profileImage: data.profileImage,
              receivedMessages: data.receivedMessages,
              sentMessages: data.sentMessages,
            });
            setLoading(false); // Set loading to false once data is fetched
          } catch (error) {
            console.error("Error fetching user data:", error);
            setLoading(false); // Set loading to false even in case of error
          }
        }
      }
    };
    fetchData();
  }, [session, setUser]);

  const handleImageUpload = async (imageUrl: string) => {
    const userId = user?._id; // Get the user's ID from the Recoil state
    if (userId) {
      try {
        // API call to update the user profile image
        await updateProfileImage(userId, imageUrl);
        // Update the Recoil state with the new profile image
        setUser((prevUser) => {
          if (!prevUser) return prevUser; // In case prevUser is null, do nothing
          return {
            ...prevUser, // Spread all existing properties
            profileImage: imageUrl, // Update the profileImage field
          };
        });
      } catch (error) {
        console.error("Error updating profile image:", error);
      }
    }
  };

  const toggleIsWorker = async () => {
    const userId = user?._id; // Get the user's ID from the Recoil state
    if (userId) {
      try {
        const updatedIsWorker = !user?.isWorker;
        // API call to update the user profile
        await updateIsWorkerStatus(userId, updatedIsWorker);
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
    }
  };

  if (!session) {
    return <div>Access Denied</div>;
  }

  if (loading) {
    return <Loader />;
  }

  if (user) {
    console.log("user from profile page: ", user);
    const { isWorker, profileImage } = user;

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
        <div className={styles.profile_upload_div}>
          <CldUploadWidget
            uploadPreset="community_helpers"
            onSuccess={(result) => {
              const imageInfo = result.info;
              if (imageInfo && typeof imageInfo !== "string") {
                // Ensure imageInfo is not a string or undefined
                handleImageUpload(imageInfo.secure_url); // Access secure_url safely
              }
            }}
            onQueuesEnd={(result, { widget }) => {
              widget.close();
            }}
          >
            {({ open }) => {
              return (
                <button
                  onClick={() => open()}
                  className={styles.upload_widget_button}
                >
                  {profileImage ? "Edit" : "Upload a"} Profile Photo
                </button>
              );
            }}
          </CldUploadWidget>
        </div>
        <ProfileCard user={user} size='large' isProfilePage={true} />
        <h2 className={styles.profile_table_title_received}>Received Messages</h2>
        {renderReceivedMessages()}
        <h2 className={styles.profile_table_title_sent}>Sent Messages</h2>
        {renderSentMessages()}
      </div>
    );
  }
}
