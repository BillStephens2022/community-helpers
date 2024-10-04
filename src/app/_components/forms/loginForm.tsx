"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginButton from "../ui/LoginButton";
import styles from "./signup.module.css";


interface LoginFormProps {
  closeModal: () => void;
}

const LoginForm = ({ closeModal } : LoginFormProps) => {
  // router will be used to redirect the user to the profile page after logging in
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { email, password } = formData;
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      console.log("Logged in successfully!");
      closeModal();
      router.push("/profile");
    }
  };

  return (
    <>
      <form className={styles.form}>
        <div>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="email"
            className={styles.input}
            id="email"
            onChange={handleChange}
            value={formData.email}
          />
        </div>
        <div>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="password"
            className={styles.input}
            id="password"
            onChange={handleChange}
            value={formData.password}
          />
        </div>

        {/* If error, display the error message */}
        {error && <p className={styles.error}>{error}</p>}{" "}
        
        <div className={styles.button_div}>
          <LoginButton onClick={handleSubmit} type="submit">
            Submit
          </LoginButton>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
