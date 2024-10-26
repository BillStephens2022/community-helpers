"use client";

import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { User } from "../../_lib/types";
import { userState } from "../../_atoms/userAtom";
import { updateUserSkillset } from "../../_utils/api/users";
import { skillsetOptions } from "../../_lib/constants";
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
      await updateUserSkillset(user._id, formData.skillset || ""); //set to empty string if no skillset is selected
      // If successful, clear the error message
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
