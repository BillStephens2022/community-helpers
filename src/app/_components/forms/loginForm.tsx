"use client";

import { useState } from "react";
import LoginButton from "../ui/LoginButton";
import styles from "./signup.module.css";

const loginUser = async (
  email: string,
  password: string
) => {
  const response = await fetch("/api/auth/login", {
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

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    const { email, password } = formData;
    loginUser(email, password);
  }

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
