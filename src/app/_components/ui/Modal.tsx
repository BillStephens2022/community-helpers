"use client";

import { CldImage } from "next-cloudinary";
import styles from "./modal.module.css";

interface ModalProps {
  onClose: () => void;
  content: React.ReactNode;
  title?: string;
  profileImage?: string | null;
}
const Modal: React.FC<ModalProps> = ({
  onClose,
  content,
  title,
  profileImage,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.titleBar}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.title_right_group}>
            {profileImage && (
              <CldImage
                src={profileImage}
                alt="user's profile image"
                radius={50}
                width={30}
                height={30}
                crop={{ type: "thumb", gravity: "face" }}
                className={styles.profileImage}
              />
            )}
            <button className={styles.closeButton} onClick={onClose}>
              &times;
            </button>
          </div>
        </div>
        <div className={styles.modalContent}>{content}</div>
      </div>
    </div>
  );
};

export default Modal;
