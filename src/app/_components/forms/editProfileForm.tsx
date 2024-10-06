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

  // Define the skillset options in an array
  const skillsetOptions = [
    "Handyman",
    "Landscaping",
    "Housekeeping",
    "Technology",
    "Finance/Accounting",
    "Auto Repair",
    "Child / Senior Care",
    "Pet Sitting",
    "Tutoring"
  ];

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update user.");
      } else {
        // Success: close modal and refresh profile page
        closeModal();
        router.push("/profile"); // Or any other route to refresh the user data
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setError("An error occurred while updating the user.");
    }
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
          <select
            name="skillset"
            className={styles.input}
            id="skillset"
            onChange={handleChange}
            value={formData.skillset}
          >
            <option value="">Select a skillset</option>
            {skillsetOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          </div>
          <div>
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
