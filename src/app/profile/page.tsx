"use client";

import { ReactNode, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { CldUploadWidget } from "next-cloudinary";
// import { CldImage } from "next-cloudinary";
import { userState } from "../_atoms/userAtom";
import styles from "./profile.module.css";
// import Modal from "../_components/ui/Modal";
import { Switch } from "@mantine/core";
// import { MdOutlineEdit } from "react-icons/md";
// import { IoMdAddCircleOutline } from "react-icons/io";
// import { FaRegTrashCan } from "react-icons/fa6";
// import EditSkillsetForm from "../_components/forms/editSkillsetForm";
// import EditAboutTextForm from "../_components/forms/editAboutTextForm";
// import AddSkillForm from "../_components/forms/addSkillForm";
import ProfileCard from "../_components/ProfileCard";
import Loader from "../_components/ui/Loader";

export default function Profile() {
  const { data: session } = useSession();
  const setUser = useSetRecoilState(userState);
  const user = useRecoilValue(userState);
  const [loading, setLoading] = useState(true);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  // const [modalTitle, setModalTitle] = useState<string>("");

  // const openModal = (title: string, content: ReactNode) => {
  //   setModalTitle(title);
  //   setModalContent(content);
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  //   setModalTitle("");
  //   setModalContent(null);
  // };

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

  // const handleDeleteSkill = async (skillToDelete: string) => {
  //   try {
  //     const userId = user?.id;

  //     // API call to delete the skill from the backend
  //     const res = await fetch(`/api/users/${userId}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ skill: skillToDelete }), // Send the skill to delete
  //     });

  //     if (!res.ok) {
  //       throw new Error("Failed to delete skill.");
  //     }

  //     // Update Recoil state to remove the deleted skill
  //     setUser((prevUser) => {
  //       if (!prevUser || !prevUser.skills) return prevUser; // Guard clause
  //       return {
  //         ...prevUser,
  //         skills: prevUser.skills.filter((skill) => skill !== skillToDelete), // Filter out the deleted skill
  //       };
  //     });
  //   } catch (error) {
  //     console.error("Error deleting skill:", error);
  //   }
  // };

  if (!session) {
    return <div>Access Denied</div>;
  }

  if (loading) {
    return <Loader />;
  }

  if (user) {
    console.log("user from profile page: ", user);
    const {
      // id,
      // firstName,
      // lastName,
      // email,
      // skillset,
      // skills,
      // aboutText,
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
            onSuccess={(result, { widget }) => {
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
        {/* <div className={styles.profile_card}>
          {profileImage && (
            <CldImage
              src={profileImage} // Use this sample image or upload your own via the Media Explorer
              alt="sample image"
              width="500" // Transform the image: auto-crop to square aspect_ratio
              height="500"
              crop={{
                type: "auto",
                source: true,
              }}
            />
          )}

          <div className={styles.profile_aboutMe}>
            <h1 className={styles.profile_h1}>
              {firstName} {lastName}
            </h1>
            <div className={styles.profile_skillset}>
              <MdOutlineEdit
                className={styles.profile_editIcon}
                onClick={() =>
                  openModal(
                    "Edit Skillset",
                    <EditSkillsetForm closeModal={closeModal} user={user} />
                  )
                }
              />
              <h2 className={styles.profile_h2}>{skillset}</h2>
            </div>
            <div className={styles.profile_aboutText}>
              <p className={styles.profile_p}>{aboutText}</p>
              <MdOutlineEdit
                className={styles.profile_editIcon}
                onClick={() =>
                  openModal(
                    "Edit About Me",
                    <EditAboutTextForm closeModal={closeModal} user={user} />
                  )
                }
              />
            </div>
            <div className={styles.profile_skills}>
              <div className={styles.profile_skills_header}>
                <h3 className={styles.profile_h3}>Skills</h3>
              </div>
              <ul className={styles.profile_ul}>
                {skills?.map((skill) => (
                  <li key={skill} className={styles.profile_li}>
                    {skill}{" "}
                    <FaRegTrashCan
                      color="white"
                      className={styles.profile_trashIcon}
                      onClick={() => handleDeleteSkill(skill)}
                    />
                  </li>
                ))}
              </ul>
              <div className={styles.profile_add_skill_div}>
                <IoMdAddCircleOutline
                  className={styles.profile_addSkillIcon}
                  onClick={() =>
                    openModal(
                      "Add Skill",
                      <AddSkillForm closeModal={closeModal} user={user} />
                    )
                  }
                />
                <span className={styles.profile_add_skill_span}>Add Skill</span>
              </div>
            </div>
          </div>
        </div> */}
        <ProfileCard user={user} isProfilePage={true} />

        {/* {isModalOpen && (
          <Modal
            onClose={closeModal}
            title={modalTitle}
            content={modalContent}
          />
        )} */}
      </div>
    );
  }
}
