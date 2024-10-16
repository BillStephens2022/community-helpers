"use client";

import { useState, FormEvent } from "react";
import { useSetRecoilState } from "recoil";
import { User, ContractBody } from "../../_lib/types";
import { contractsState } from "../../_atoms/contractAtom";
import Button from "../ui/Button";
import styles from "./sendMessageForm.module.css";

interface ContractFormProps {
  closeModal: () => void;
  user: User;
  loggedInUserId?: string;
  loggedInUsername?: string;
}

const ContractForm = ({
  closeModal,
  user,
  loggedInUserId,
  loggedInUsername,
}: ContractFormProps) => {
  const initialFormData = {
    client: "",
    jobCategory: "",
    jobDescription: "",
    feeType: "",
    hourlyRate: null,
    hours: null,
    fixedRate: null,
    additionalNotes: null,
  };
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setContracts = useSetRecoilState(contractsState);
  console.log("user in form: ", user);
  const requiredFields = ["jobCategory", "jobDescription", "feeType"];

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // Reset the error for the field when it changes
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    requiredFields.forEach((field) => {
      const key = field as keyof typeof formData; // Type assertion

      if (!formData[key]?.toString().trim()) {
        newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validateFields()) {
      return; // Stop if validation fails
    }
    console.log("form data: ", formData);
    console.log("from: ", loggedInUserId);
    console.log("to: ", user._id);
    try {
      const response = await fetch(`/api/contracts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          worker: loggedInUserId,
          client: user._id,
          jobCategory: formData.jobCategory,
          jobDescription: formData.jobDescription,
          feeType: formData.feeType,
          hourlyRate: formData.hourlyRate ?? null,
          hours: formData.hours ?? null,
          fixedRate: formData.fixedRate ?? null,
          amountDue:
            formData.hourlyRate && formData.hours
              ? formData.hourlyRate * formData.hours
              : formData.fixedRate,
          additionalNotes: formData.additionalNotes,
          status: "Draft - Awaiting Client Approval",
        }), // Send form data as JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Dynamically set errors based on API response
        const apiErrors: Record<string, string> = {};
        for (const [key, value] of Object.entries(errorData)) {
            if (typeof value === "string") {
              // If value is a string, assign it directly
              apiErrors[key] = value;
            } else if (Array.isArray(value)) {
              // If value is an array, join it into a single string
              apiErrors[key] = value.join(", ");
            } else {
              // Fallback: Convert non-string/array values to a string
              apiErrors[key] = JSON.stringify(value);
            }
          }
        setErrors(apiErrors); // Set the errors from API response
      } else {
        const newContract: ContractBody = await response.json();
        // Update Recoil contracts state
        setContracts((prevContracts) => [...prevContracts, newContract]);
        // Clear form data and close modal
        setFormData(initialFormData);
        closeModal();
      }
    } catch (error) {
      console.error("An error occurred while creating the contract: ", error);
      // Set a generic error message if an exception occurs
      setErrors({
        contractForm: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <>
      <form className={styles.form}>
        <div className={styles.static_field}>
          <label className={styles.label}>Worker:</label>
          <p className={styles.form_p1}>{loggedInUsername}</p>{" "}
          {/* Not editable */}
        </div>
        <div className={styles.static_field}>
          <label className={styles.label}>Client:</label>
          <p className={styles.form_p2}>
            {user.firstName} {user.lastName}
          </p>{" "}
          {/* Not editable */}
        </div>
        <div>
          <label htmlFor="jobCategory" className={styles.label}>
            Job Category
          </label>
          <input
            name="jobCategory"
            placeholder="job category"
            className={styles.input}
            id="jobCategory"
            onChange={handleChange}
            value={formData.jobCategory}
          />
          {errors.jobCategory && (
            <p className={styles.error}>{errors.jobCategory}</p>
          )}
        </div>
        <div>
          <label htmlFor="jobDescription" className={styles.label}>
            Job Description
          </label>
          <textarea
            name="jobDescription"
            placeholder="job description"
            className={styles.textarea}
            id="jobDescription"
            onChange={handleChange}
            value={formData.jobDescription}
            rows={5}
          />
          {errors.jobDescription && (
            <p className={styles.error}>{errors.jobDescription}</p>
          )}
        </div>
        <div className={styles.button_div}>
          <Button onClick={handleSubmit} type="submit">
            Create Contract
          </Button>
        </div>
      </form>
    </>
  );
};

export default ContractForm;
