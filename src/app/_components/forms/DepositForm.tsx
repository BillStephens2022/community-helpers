"use client";

import { useState, FormEvent } from "react";
import { useSetRecoilState } from "recoil";
import { User } from "../../_lib/types";
import { userState } from "../../_atoms/userAtom";
import { updateWalletBalance } from "../../_utils/api/users";
import Button from "../ui/Button";
import styles from "./oneFieldForm.module.css";

interface DepositFormProps {
  closeModal: () => void;
  user: User;
}

const DepositForm = ({ closeModal, user }: DepositFormProps) => {
  const [formData, setFormData] = useState({
    depositAmount: 0,
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
    if (formData.depositAmount <= 0) {
      setError("Please enter a deposit amount greater than zero.");
      return;
    }

    const originalBalance = user.walletBalance; // Save original balance in case of rollback

    try {
      await updateWalletBalance(user._id, formData.depositAmount || 0, "add"); // if empty, send zero
      // Success: clear any error messages, reset user state, and refresh profile page
      setError("");
      // Update Recoil state directly with updated wallet balance to reflect changes immediately
      setUser((prevUser) => {
        if (!prevUser) return prevUser; // If prevUser is null, do nothing
        return {
          ...prevUser, // Spread the existing user properties
          walletBalance: prevUser.walletBalance + formData.depositAmount, // Update only wallet balance
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
          <label htmlFor="depositAmount" className={styles.label}>
            Deposit Funds
          </label>
          <input
            type="number"
            name="depositAmount"
            placeholder="deposit amount"
            className={styles.input}
            id="depositAmount"
            onChange={handleChange}
            value={formData.depositAmount}
            min={0}
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

export default DepositForm;
