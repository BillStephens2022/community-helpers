"use client";

import { useState, FormEvent } from "react";
import { useSetRecoilState } from "recoil";
import { User, MessageBody } from "../../_lib/types";
import { messagesState } from "../../_atoms/messageAtom";
import { sendMessage } from "../../_utils/api/messages";
import Button from "../ui/Button";
import styles from "./sendMessageForm.module.css";

interface SendMessageFormProps {
  closeModal: () => void;
  user: User;
  loggedInUserId?: string;
  loggedInUsername?: string;
}

const SendMessageForm = ({
  closeModal,
  user,
  loggedInUserId,
  loggedInUsername,
}: SendMessageFormProps) => {
  const [formData, setFormData] = useState({
    messageSubject: "",
    messageText: "",
  });
  const [errors, setErrors] = useState<{ subject?: string; message?: string }>(
    {}
  );

  const setMessages = useSetRecoilState(messagesState);
  console.log("user in form: ", user);
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateFields = () => {
    const newErrors: { subject?: string; message?: string } = {};

    if (!formData.messageSubject.trim()) {
      newErrors.subject = "Subject is required.";
    }

    if (!formData.messageText.trim()) {
      newErrors.message = "Message text is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validateFields()) return;

    try {
      const newMessage: MessageBody = await sendMessage(
        loggedInUserId || "",
        user._id,
        formData.messageSubject,
        formData.messageText
      );
      // Update Recoil messages state
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      // Clear form data and close modal
      setFormData({ messageSubject: "", messageText: "" });
      closeModal();
    } catch (error) {
      console.error("An error occurred while sending the message: ", error);
      setErrors({ message: "An error occurred while sending the message." });
    }
  };

  return (
    <>
      <form className={styles.form}>
        <div className={styles.static_field}>
          <label className={styles.label}>From:</label>
          <p className={styles.form_p1}>{loggedInUsername}</p>{" "}
          {/* Not editable */}
        </div>
        <div className={styles.static_field}>
          <label className={styles.label}>To:</label>
          <p className={styles.form_p2}>
            {user.firstName} {user.lastName}
          </p>{" "}
          {/* Not editable */}
        </div>
        <div>
          <label htmlFor="messageSubject" className={styles.label}>
            Subject
          </label>
          <input
            name="messageSubject"
            placeholder="subject"
            className={styles.input}
            id="messageSubject"
            onChange={handleChange}
            value={formData.messageSubject}
          />
          {errors.subject && <p className={styles.error}>{errors.subject}</p>}
        </div>
        <div>
          <label htmlFor="messageText" className={styles.label}>
            Message Text
          </label>
          <textarea
            name="messageText"
            placeholder="message text"
            className={styles.textarea}
            id="messageText"
            onChange={handleChange}
            value={formData.messageText}
            rows={5}
          />
          {errors.message && <p className={styles.error}>{errors.message}</p>}
        </div>
        <div className={styles.button_div}>
          <Button onClick={handleSubmit} type="submit">
            Send Message
          </Button>
        </div>
      </form>
    </>
  );
};

export default SendMessageForm;
