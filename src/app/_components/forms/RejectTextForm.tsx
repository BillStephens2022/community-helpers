"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSetRecoilState } from "recoil";
import { userState, userContractsState } from "../../_atoms/userAtom";
import { updateRejectText } from "../../_utils/api/contracts";
import Button from "../ui/Button";
import styles from "./oneFieldForm.module.css";


interface RejectTextFormProps {
  closeModal: () => void;
  contractId: string;
}

const RejectTextForm = ({ closeModal, contractId }: RejectTextFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    rejectionText: "",
  });
  const [error, setError] = useState("");
  const setContracts = useSetRecoilState(userContractsState);
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
    setError("");

    // Optimistic update to show rejection text immediately
    setContracts((prevContracts) =>
      prevContracts.map((contract) =>
        contract._id === contractId
          ? { ...contract, rejectionText: formData.rejectionText, status: "Rejected by Client - Awaiting Revision" }
          : contract
      )
    );

    try {
      await updateRejectText(contractId, formData.rejectionText || ""); // if empty, send empty string
      // Success: clear any error messages, reset user state, and refresh profile page
      setError("");
      // Update Recoil state directly with new rejection text to reflect changes immediately
      closeModal();
      router.refresh();
    } catch (error) {
      console.error("Error updating contract:", error);
      setError("An error occurred while updating the contract.");

       // Rollback optimistic update if error occurs
       setContracts((prevContracts) =>
        prevContracts.map((contract) =>
          contract._id === contractId ? { ...contract, rejectionText: "" } : contract
        )
      );
    }
  };

  return (
    <>
      <form className={styles.form}>
        <div>
          <label htmlFor="rejectionText" className={styles.label}>
            Feedback
          </label>
          <textarea
            name="rejectionText"
            placeholder="provide feedback on why you are rejecting this contract"
            className={styles.input}
            id="rejectionText"
            onChange={handleChange}
            value={formData.rejectionText}
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

export default RejectTextForm;