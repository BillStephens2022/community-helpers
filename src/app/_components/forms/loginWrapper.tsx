import { useState } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import styles from "./loginWrapper.module.css";


interface LoginWrapperProps {
  closeModal: () => void; // Define the type for closeModal
}

export default function LoginWrapper({ closeModal } : LoginWrapperProps ) {
  const [formSelect, setFormSelect] = useState("login");

  return (
    <>
      <div className={styles.formLinks}>
        <span
          onClick={() => setFormSelect("login")}
          className={`${styles.formLink} ${
            formSelect === "login" ? styles.active : ""
          }`}
        >
          Login
        </span>
        <span
          onClick={() => setFormSelect("signup")}
          className={`${styles.formLink} ${
            formSelect === "signup" ? styles.active : ""
          }`}
        >
          Signup
        </span>
      </div>
      {formSelect === "signup" ? <SignupForm closeModal={closeModal} /> : <LoginForm closeModal={closeModal} />}
    </>
  );
}
