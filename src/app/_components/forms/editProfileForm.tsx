"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import styles from "./editProfileForm.module.css";
import { User } from "../../_lib/types";

interface EditProfileFormProps {
  closeModal: () => void;
  user: User;
}

const EditProfileForm = ({ closeModal, user }: EditProfileFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    skillset: user.skillset,
    skills: user.skills,
    aboutText: user.aboutText,
    isWorker: user.isWorker,
  });
  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const {
      firstName,
      lastName,
      email,
      skillset,
      skills,
      aboutText,
      isWorker,
    } = formData;
    // const result = await signIn("credentials", {
    //   redirect: false,
    //   email,
    //   password,
    // });

    // if (result?.error) {
    //   console.error("Login error:", result.error);
    //   setError(result.error);
    // } else {
    //   console.log("Logged in successfully!");
    //   closeModal();
    //   router.push("/profile");
    // }
  };

  return (
    <>
      <form className={styles.form}>
        <div>
          <label htmlFor="firstName" className={styles.label}>
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            placeholder="first name"
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
            type="text"
            name="lastName"
            placeholder="last name"
            className={styles.input}
            id="lastName"
            onChange={handleChange}
            value={formData.lastName}
          />
        </div>
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
          <label htmlFor="skillset" className={styles.label}>
            Skillset
          </label>
          <input
            type="text"
            name="skillset"
            placeholder="skillset"
            className={styles.input}
            id="skillset"
            onChange={handleChange}
            value={formData.skillset}
          />
          <label htmlFor="aboutText" className={styles.label}>
            About me
          </label>
          <textarea
            name="aboutText"
            placeholder="about me"
            className={styles.input}
            id="aboutText"
            onChange={handleChange}
            value={formData.aboutText}
            rows={5}
          />
        </div>
        {/* If error, display the error message */}
        {error && <p className={styles.error}>{error}</p>}{" "}
        <div className={styles.button_div}>
          <Button onClick={handleSubmit} type="submit">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
};

export default EditProfileForm;
