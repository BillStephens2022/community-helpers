"use client"

import { useState } from "react";
import Modal from "../_components/ui/Modal";
import LoginWrapper from "../_components/forms/LoginWrapper";
import LoginButton from "../_components/ui/LoginButton";
import styles from "./page.module.css";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
    <h2 className={styles.login_h2}>Register / Login Page</h2>
    {!isModalOpen && (<LoginButton onClick={openModal} type="button">Sign Up / Log In</LoginButton>)}
    {isModalOpen && (
        <Modal
          onClose={closeModal}
          title="Sign Up / Log In"
          content={<LoginWrapper closeModal={closeModal} />}
        />
      )}
    </>
  );
}
