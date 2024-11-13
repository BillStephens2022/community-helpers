import { ReactNode, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import { FaRegMessage } from "react-icons/fa6";
import { User } from "../_lib/types";
import Modal from "./ui/Modal";
import CardButton from "./ui/CardButton";
import SendMessageForm from "./forms/SendMessageForm";
import styles from "./communityCard.module.css";

interface CommunityCardProps {
  user: User;
}

const CommunityCard = ({
  user
}: CommunityCardProps) => {
  const { data: session } = useSession();
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
  } = user;

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
                width={140}
                height={140}
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
          {isOtherSide ? "back..." : "about..."}
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

export default CommunityCard;
