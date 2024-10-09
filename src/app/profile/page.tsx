"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { CldUploadWidget } from "next-cloudinary";
import { userState } from "../_atoms/userAtom";
import styles from "./profile.module.css";
import { Switch } from "@mantine/core";
import ProfileCard from "../_components/ProfileCard";
import Loader from "../_components/ui/Loader";

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
            id: userId || "",
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            skillset: data.skillset,
            skills: data.skills,
            aboutText: data.aboutText,
            isWorker: data.isWorker,
            profileImage: data.profileImage,
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

  const handleImageUpload = async (imageUrl: string) => {
    try {
      const userId = user?.id; // Get the user's ID from the Recoil state

      // API call to update the user's profile image
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileImage: imageUrl }), // Send the new image URL
      });

      if (!res.ok) {
        throw new Error("Failed to update profile image.");
      }

      // Optionally, update the Recoil state with the new profile image
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
  };

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
    return <Loader />;
  }

  if (user) {
    console.log("user from profile page: ", user);
    const {
      isWorker,
      profileImage,
    } = user;

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

        <ProfileCard user={user} isProfilePage={true} />

      </div>
    );
  }
}
