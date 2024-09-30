"use client";

import { useState } from "react";
import LoginButton from "../ui/LoginButton";
import styles from "./signup.module.css";

const createUser = async (email: string, password: string) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
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

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmedPassword: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { email, password, confirmedPassword } = formData;
    
    if (password === confirmedPassword) {
      try {
        const result = await createUser(email, password);
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Passwords don't match, try again!");
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
          <div>
            <label htmlFor="confirm" className={styles.label}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm-password"
              placeholder="confirm password"
              className={styles.input}
              id="confirm-password"
              onChange={handleChange}
              value={formData.confirmedPassword}
            />
          </div>
          <LoginButton onClick={handleSubmit} type="submit">Submit</LoginButton>
        </form>
    </>
  );
};

export default SignupForm;
