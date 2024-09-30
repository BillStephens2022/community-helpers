"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./navigation.module.css";
import Modal from "../ui/Modal";
import SignupForm from "../forms/signupForm";

export default function Navigation() {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navbar_ul}>
        <li>
          <Link href="/about" className={styles.navbar_link}>
            About
          </Link>
        </li>
        <li>
          <Link href="/profile" className={styles.navbar_link}>
            Profile
          </Link>
        </li>
        <li>
          <button type="button" onClick={openModal} className={styles.navbar_login}>Sign Up / Log In</button>
        </li>
      </ul>
      {isModalOpen && (
        <Modal onClose={closeModal} title="Sign Up / Log In" content={<SignupForm />} />
      )}
    </nav>
  );
}
