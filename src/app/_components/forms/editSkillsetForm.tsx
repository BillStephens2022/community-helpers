"use client";

import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { User } from "../../_lib/types";
import { userState } from "../../_atoms/userAtom";
import Button from "../ui/Button";
import styles from "./editSkillsetForm.module.css";

interface EditSkillsetFormProps {
  closeModal: () => void;
  user: User;
}

const EditSkillsetForm = ({ closeModal, user }: EditSkillsetFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    skillset: user.skillset,
  });
  const [error, setError] = useState("");
  const setUser = useSetRecoilState(userState);

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
    "Tutoring",
  ];

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
        // Success: clear any error messages, reset user state, and refresh profile page
        setError("");

        // Update Recoil state directly with new skillset to reflect changes immediately
        setUser((prevUser) => {
          if (!prevUser) return prevUser; // If prevUser is null, do nothing

          return {
            ...prevUser, // Spread the existing user properties
            skillset: formData.skillset, // Update only the skillset field
          };
        });

        closeModal();
        router.refresh();
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

export default EditSkillsetForm;
