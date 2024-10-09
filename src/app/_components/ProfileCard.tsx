import { ReactNode, useState, useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { CldImage } from "next-cloudinary";
import { MdOutlineEdit } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaRegTrashCan } from "react-icons/fa6";
import { User } from "../_lib/types";
import { userState } from "../_atoms/userAtom";
import Modal from "../_components/ui/Modal";
import EditSkillsetForm from "../_components/forms/editSkillsetForm";
import EditAboutTextForm from "../_components/forms/editAboutTextForm";
import AddSkillForm from "../_components/forms/addSkillForm";
import styles from "./profileCard.module.css";

interface ProfileCardProps {
  user: User;
  isProfilePage: boolean;
}

const ProfileCard = ({ user, isProfilePage = false }: ProfileCardProps) => {
  const setUser = useSetRecoilState(userState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [modalTitle, setModalTitle] = useState<string>("");

  const openModal = (title: string, content: ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalContent(null);
  };

 
    const {
      id,
      firstName,
      lastName,
      email,
      skillset,
      skills,
      aboutText,
      isWorker,
      profileImage,
    } = user;
  

  const handleDeleteSkill = async (skillToDelete: string) => {
    try {
      const userId = user?.id;

      // API call to delete the skill from the backend
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skill: skillToDelete }), // Send the skill to delete
      });

      if (!res.ok) {
        throw new Error("Failed to delete skill.");
      }

      // Update Recoil state to remove the deleted skill
      setUser((prevUser) => {
        if (!prevUser || !prevUser.skills) return prevUser; // Guard clause
        return {
          ...prevUser,
          skills: prevUser.skills.filter((skill) => skill !== skillToDelete), // Filter out the deleted skill
        };
      });
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  return (
    <>
    <div className={styles.profile_card}>
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
    </div>
    {isModalOpen && (
        <Modal
          onClose={closeModal}
          title={modalTitle}
          content={modalContent}
        />
      )}
      </>
  );
};

export default ProfileCard;
