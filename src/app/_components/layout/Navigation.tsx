"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./navigation.module.css";
import Modal from "../ui/Modal";
import LoginWrapper from "../forms/loginWrapper";
import { signOut, useSession } from "next-auth/react";


export default function Navigation() {
  const session = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  console.log("Session: ", session);  

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogoff = async () => {
    await signOut({ redirect: true, callbackUrl: "/" }); // Redirect to homepage after logging out
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navbar_ul}>
        <li>
          <Link href="/about" className={styles.navbar_link}>
            About
          </Link>
        </li>
        {session ? (
          <>
            <li>
              <Link href="/profile" className={styles.navbar_link}>
                Profile
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={handleLogoff}
                className={styles.navbar_logout}
              >
                Log Out
              </button>
            </li>
          </>
        ) : (
          <li>
            <button
              type="button"
              onClick={openModal}
              className={styles.navbar_login}
            >
              Sign Up / Log In
            </button>
          </li>
        )}
      </ul>
      {isModalOpen && (
        <Modal
          onClose={closeModal}
          title="Sign Up / Log In"
          content={<LoginWrapper closeModal={closeModal} />}
        />
      )}
    </nav>
  );
}
