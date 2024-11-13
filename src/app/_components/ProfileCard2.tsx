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
import CardButton from "./ui/CardButton";
import { deleteUserSkill } from "../_utils/api/users";
import SendMessageForm from "./forms/SendMessageForm";
import styles from "./profileCard2.module.css";
import { sendMessage } from "../_utils/api/messages";

interface ProfileCardProps {
  user: User;
  size: "large" | "small";
  isProfilePage: boolean;
}

const ProfileCard2 = ({
  user,
  size,
  isProfilePage = false,
}: ProfileCardProps) => {
  const { data: session } = useSession();
  const setUser = useSetRecoilState(userState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [isOtherSide, setIsOtherSide] = useState(false);

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

  const showOtherSide = () => {
    setIsOtherSide((prev) => !prev);
  };

  return (
    <div className={styles.card}>
      {!isOtherSide && (
        <div className={`${styles.card_face} ${styles.card_face1}`}>
          <div className={styles.card_imgbox}>
            {profileImage && (
              <CldImage
                src={profileImage}
                alt="sample image"
                width={size === "small" ? 140 : 500}
                height={size === "small" ? 140 : 500}
                crop={{
                  type: "auto", // Transform the image: auto-crop to square aspect_ratio
                  source: true,
                }}
                className={styles.card_img}
                radius="max"
              />
            )}
            <h3>
              {firstName} {lastName}
            </h3>
            <h4 className={styles.skillset_h4}>{skillset}</h4>
          </div>
        </div>
      )}
      {isOtherSide && (
        <div className={`${styles.card_face} ${styles.card_face2}`}>
          <div className={styles.card_content}>
            <p className={styles.profile_about_text}>
              {aboutText ? aboutText : ""}
            </p>
            <h3 className={styles.profile_h3}>Skills</h3>

            <ul className={styles.profile_ul}>
              {skills?.map((skill) => (
                <li key={skill} className={styles.profile_li}>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className={styles.profile_card_footer}>
        <CardButton type="button" onClick={() => showOtherSide()}>
          {isOtherSide ? "back..." : "more..."}
        </CardButton>
        <CardButton
          type="button"
          onClick={() =>
            openModal(
              "Send Message",
              <SendMessageForm
                closeModal={closeModal}
                user={user}
                loggedInUserId={loggedInUserId}
                loggedInUsername={loggedInUsername || ""}
              />
            )
          }
          hasIcon={true}
        >
          <FaRegMessage color="white" size={20} aria-label="Send Message" />{" "}
        </CardButton>
      </div>
      {isModalOpen && (
        <Modal onClose={closeModal} title={modalTitle} content={modalContent} />
      )}
    </div>
  );
};

export default ProfileCard2;
