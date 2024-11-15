"use client";

import { useState, FormEvent } from "react";
import { useSetRecoilState } from "recoil";
import { User } from "../../_lib/types";
import { userState } from "../../_atoms/userAtom";
import { updateWalletBalance } from "../../_utils/api/users";
import Button from "../ui/Button";
import styles from "./oneFieldForm.module.css";

interface WalletFormProps {
  closeModal: () => void;
  user: User;
  type: "deposit" | "withdraw";
}

const WalletForm = ({ closeModal, user, type }: WalletFormProps) => {
  const [formData, setFormData] = useState({
    amount: 0,
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
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Validate that depositAmount is a positive number
    if (formData.amount <= 0) {
      setError(`Please enter a ${type === "deposit" ? "deposit" : "withdrawal"} amount greater than zero.`);
      return;
    }

    if (type === "withdraw" && formData.amount > user.walletBalance) {
      setError("Insufficient funds for withdrawal.");
      return;
    }

    const originalBalance = user.walletBalance; // Save original balance in case of rollback

    try {
      await updateWalletBalance(user._id, formData.amount || 0, type === "deposit" ? "add" : "subtract"); // if empty, send zero
      // Success: clear any error messages, reset user state, and refresh profile page
      setError("");
      // Update Recoil state directly with updated wallet balance to reflect changes immediately
      setUser((prevUser) => {
        if (!prevUser) return prevUser; // If prevUser is null, do nothing
        return {
          ...prevUser, // Spread the existing user properties
          walletBalance: prevUser.walletBalance + (type === "deposit" ? formData.amount : -formData.amount), // Update only wallet balance
        };
      });
      closeModal();
    } catch (error) {
      console.error("Error updating user's wallet balance:", error);
      setError("An error occurred while updating the user's wallet balance.");
      // Roll back to the original balance if the update fails
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        return {
          ...prevUser,
          walletBalance: originalBalance,
        };
      });
    }
  };

  return (
    <>
      <form className={styles.form}>
        <div>
          <label htmlFor="amount" className={styles.label}>
            {type === "deposit" ? "Deposit Amount" : "Withdrawal Amount"}
          </label>
          <input
            type="number"
            name="amount"
            placeholder={type==="deposit" ? "Enter deposit amount" : "Enter withdrawal amount"}
            className={styles.input}
            id="amount"
            onChange={handleChange}
            value={formData.amount}
            min={0}
            max={type === "withdraw" ? user.walletBalance : undefined}
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

export default WalletForm;
