import { ReactNode, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import { MdOutlineEdit } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaRegTrashCan, FaRegMessage } from "react-icons/fa6";
import { User } from "../_lib/types";
import { userState } from "../_atoms/userAtom";
import Modal from "../_components/ui/Modal";
import EditSkillsetForm from "./forms/EditSkillsetForm";
import EditAboutTextForm from "./forms/EditAboutTextForm";
import AddSkillForm from "./forms/AddSkillForm";
import { deleteUserSkill } from "../_utils/api/users";
import styles from "./profileCard.module.css";
import SendMessageForm from "./forms/SendMessageForm";

interface ProfileCardProps {
  user: User;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  const { data: session } = useSession();
  const setUser = useSetRecoilState(userState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [modalTitle, setModalTitle] = useState<string>("");

  const loggedInUserId = session?.user?.id;
  const loggedInUsername = session?.user?.name;

  useEffect(() => {
    if (session) {
      console.log("Session:", session);
    }
  }, [session]);

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
    firstName,
    lastName,
    skillset,
    skills,
    aboutText,
    profileImage,
    walletBalance,
  } = user;

  const handleDeleteSkill = async (skillToDelete: string) => {
    try {
      const userId = user?._id;

      // api call to delete the skill
      await deleteUserSkill(userId, skillToDelete);

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
        <div className={styles.profile_header_div}>
          <div className={styles.profile_image_div}>
            {profileImage && (
              <CldImage
                src={profileImage}
                alt="sample image"
                width={200}
                height={200}
                crop={{
                  type: "auto", // Transform the image: auto-crop to square aspect_ratio
                  source: true,
                }}
                radius={150}
              />
            )}
          </div>
          <div className={styles.profile_name_skillset}>
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
              <h2 className={styles.profile_h2}>
                {skillset ? skillset : "Skillset: "}
              </h2>
              </div>
              <div className={styles.profile_aboutText}>
                <p className={styles.profile_p}>
                  {aboutText ? aboutText : "About Me: "}
                </p>
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
            
          </div>
        </div>

        <div className={`${styles.profile_summary_div}`}></div>
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
      {isModalOpen && (
        <Modal onClose={closeModal} title={modalTitle} content={modalContent} />
      )}
    </>
  );
};

export default ProfileCard;
