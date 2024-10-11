"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSetRecoilState } from "recoil";
import { User, Message } from "../../_lib/types";
import { userState } from "../../_atoms/userAtom";
import Button from "../ui/Button";
import styles from "./editProfileForm.module.css";


interface SendMessageFormProps {
  closeModal: () => void;
  user: User;
  loggedInUserId?: string;
  loggedInUsername?: string;
}

const SendMessageForm = ({ closeModal, user, loggedInUserId, loggedInUsername }: SendMessageFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    messageText: "",
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

  const handleSubmit = async (event: FormEvent) => {
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
             aboutText: formData.messageText, // Update only the skillset field
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
      <div className={styles.static_field}>
          <label className={styles.label}>From:</label>
          <p>{loggedInUsername}</p> {/* Not editable */}
        </div>
        <div className={styles.static_field}>
          <label className={styles.label}>To:</label>
          <p>{user.firstName} {user.lastName}</p> {/* Not editable */}
        </div>
        <div>
          <label htmlFor="messageText" className={styles.label}>
            Message Text
          </label>
          <textarea
            name="messageText"
            placeholder="message text"
            className={styles.input}
            id="messageText"
            onChange={handleChange}
            value={formData.messageText}
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

export default SendMessageForm;