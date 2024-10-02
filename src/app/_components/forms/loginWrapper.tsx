import { useState } from "react";
import SignupForm from "./signupForm";
import LoginForm from "./loginForm";
import styles from "./loginWrapper.module.css";

export default function LoginWrapper() {
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
      {formSelect === "signup" ? <SignupForm /> : <LoginForm />}
    </>
  );
}
