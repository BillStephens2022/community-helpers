"use client";

import { useState, FormEvent } from "react";
import { useSetRecoilState } from "recoil";
import { User } from "../../_lib/types";
import { userState } from "../../_atoms/userAtom";
import { updateUserSkills } from "../../_utils/api/users";
import Button from "../ui/Button";
import styles from "./oneFieldForm.module.css";

interface AddSkillFormProps {
  closeModal: () => void;
  user: User;
}

const AddSkillForm = ({ closeModal, user }: AddSkillFormProps) => {
  const [newSkill, setNewSkill] = useState("");
  const [error, setError] = useState("");
  const setUser = useSetRecoilState(userState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewSkill(event.target.value); // Update new skill input
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!newSkill) {
      setError("Skill cannot be empty.");
      return;
    }

    try {
      // Skills is an array in the User model; initialize if it's undefined (will be undefined when user first signs up)
      const existingSkills = user.skills || [];
      // Create the updated skills array with the newly added skill
      const updatedSkills = [...existingSkills, newSkill];
      // Send the updated skills array to the server to update the user in database
      await updateUserSkills(user._id, updatedSkills);
      setError(""); // Clear any error messages
      // Update Recoil state directly with new skillset to reflect changes immediately on screen
      setUser((prevUser) => {
        if (!prevUser) return prevUser; // If prevUser is null, do nothing
        return {
          ...prevUser, // Spread the existing user properties
          skills: updatedSkills, // Update the skillset with the new skill added
        };
      });
      closeModal();
    } catch (error) {
      console.error("Error updating user:", error);
      setError("An error occurred while updating the user.");
    }
  };

  return (
    <>
      <form className={styles.form}>
        <div>
          <label htmlFor="aboutText" className={styles.label}>
            Add Skill
          </label>
          <input
            type="text"
            name="skill"
            placeholder="Enter a new skill"
            className={styles.input}
            id="skill"
            onChange={handleChange}
            value={newSkill} // Bind input value to newSkill state
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

export default AddSkillForm;
