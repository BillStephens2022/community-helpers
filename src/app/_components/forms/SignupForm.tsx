"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import LoginButton from "../ui/LoginButton";
import styles from "./signup.module.css";

interface SignupFormProps {
  closeModal: () => void;
}

const SignupForm = ({ closeModal }: SignupFormProps) => {
  // router will be used to redirect the user to the homepage after signing up
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmedPassword: "",
  });

  const [error, setError] = useState("");

  const createUser = async (
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, firstName, lastName, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong!");
    }
    return data;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { email, firstName, lastName, password, confirmedPassword } =
      formData;

    if (password !== confirmedPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      // Step 1: Create the user
      const result = await createUser(email, firstName, lastName, password);

      // Step 2: Automatically log the user in after signup
      const loginResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (loginResult?.error) {
        console.error("Login error:", loginResult.error);
        setError(loginResult.error);
      } else {
        console.log("Logged in successfully!");
        closeModal();
        router.push("/profile");
      }
    } catch (error: any) {
      console.error("Signup error:", error.message);
      setError(error.message);
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
          <label htmlFor="firstName" className={styles.label}>
            First Name
          </label>
          <input
            type="firstName"
            name="firstName"
            placeholder="firstName"
            className={styles.input}
            id="firstName"
            onChange={handleChange}
            value={formData.firstName}
          />
        </div>
        <div>
          <label htmlFor="lastName" className={styles.label}>
            Last Name
          </label>
          <input
            type="lastName"
            name="lastName"
            placeholder="lastName"
            className={styles.input}
            id="lastName"
            onChange={handleChange}
            value={formData.lastName}
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
        <div>
          <label htmlFor="confirm" className={styles.label}>
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmedPassword"
            placeholder="confirm password"
            className={styles.input}
            id="confirm-password"
            onChange={handleChange}
            value={formData.confirmedPassword}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.button_div}>
          <LoginButton onClick={handleSubmit} type="submit">
            Submit
          </LoginButton>
        </div>
      </form>
    </>
  );
};

export default SignupForm;
