"use client";

import styles from "./modal.module.css";


interface ModalProps {
  onClose: () => void;
  content: React.ReactNode;
  title?: string,
}
const Modal: React.FC<ModalProps> = ({ onClose, content, title }) => {

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
      <div className={styles.titleBar}>
        <h2 className={styles.title}>{title}</h2>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        </div>
        <div className={styles.modalContent}>{content}</div>
      </div>
    </div>
  );
};

export default Modal;