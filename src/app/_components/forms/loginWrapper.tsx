import { useState } from "react";
import SignupForm from "./signupForm";
import styles from "./loginWrapper.module.css";

export default function LoginWrapper() {
  const [formSelect, setFormSelect] = useState("signup");

  return (
    <>
      <div className={styles.formLinks}>
        <span onClick={() => setFormSelect("signup")} className={`${styles.formLink} ${formSelect === "signup" ? styles.active : ""}`}>Signup</span>
        <span onClick={() => setFormSelect("login")} className={`${styles.formLink} ${formSelect === "login" ? styles.active : ""}`}>Login</span>
      </div>
      {formSelect === "signup" ? <SignupForm /> : <h1>LoginForm</h1>}
    </>
  );
}
