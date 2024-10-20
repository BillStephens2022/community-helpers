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
    feeType: "hourly",
    hourlyRate: "",
    hours: "",
    fixedRate: "",
    additionalNotes: "",
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

    // Validate numeric fields based on feeType
    if (
      formData.feeType === "hourly" &&
      (!formData.hourlyRate || !formData.hours)
    ) {
      newErrors.hourlyRate = "Hourly rate and hours are required.";
    }

    if (formData.feeType === "fixed" && !formData.fixedRate) {
      newErrors.fixedRate = "Fixed fee is required.";
    }

    // Validate worker-client difference
    if (loggedInUserId === user._id) {
      newErrors.client = "Worker and Client cannot be the same user.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateAmountDue = () => {
    if (formData.feeType === "hourly") {
      return (
        Number(formData.hourlyRate) * Number(formData.hours) || 0
      );
    }
    return Number(formData.fixedRate) || 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validateFields()) {
      return; // Stop if validation fails
    }

    const amountDue = calculateAmountDue();

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
          hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : null,
          hours: formData.hours ? Number(formData.hours) : null,
          fixedRate: formData.fixedRate ? Number(formData.fixedRate) : null,
          amountDue: amountDue,
          additionalNotes: formData.additionalNotes,
          status: "Draft - Awaiting Client Approval",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const apiErrors = Object.fromEntries(
          Object.entries(errorData).map(([key, value]) => [
            key,
            Array.isArray(value) ? value.join(", ") : String(value),
          ])
        );
        setErrors(apiErrors);
      } else {
        const newContract: ContractBody = await response.json();
        setContracts((prev) => [...prev, newContract]);
        setFormData(initialFormData);
        closeModal();
      }
    } catch (error) {
      console.error("An error occurred: ", error);
      setErrors({ form: "An unexpected error occurred. Please try again." });
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
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
        <div>
        <label htmlFor="feeType" className={styles.label}>
          Fee Type
        </label>
        <select
          name="feeType"
          id="feeType"
          value={formData.feeType}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="hourly">Hourly</option>
          <option value="fixed">Fixed</option>
        </select>
      </div>
      {formData.feeType === "hourly" && (
        <>
          <input
            name="hourlyRate"
            placeholder="Hourly Rate"
            value={formData.hourlyRate}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            name="hours"
            placeholder="Hours"
            value={formData.hours}
            onChange={handleChange}
            className={styles.input}
          />
        </>
      )}
      {formData.feeType === "fixed" && (
        <input
          name="fixedRate"
          placeholder="Fixed Fee"
          value={formData.fixedRate}
          onChange={handleChange}
          className={styles.input}
        />
      )}
        <div>
          <label htmlFor="additionalNotes" className={styles.label}>
            Additional Notes
          </label>
          <textarea
            name="additionalNotes"
            placeholder="additional notes"
            className={styles.textarea}
            id="additionalNotes"
            onChange={handleChange}
            value={formData.additionalNotes}
            rows={5}
          />
          {errors.additionalNotes && (
            <p className={styles.error}>{errors.additionalNotes}</p>
          )}
        </div>
        <div className={styles.static_field}>
          <label className={styles.label}>Amount Due upon completion:</label>
           {/* Not editable */}
          <p className={styles.form_p1}>{calculateAmountDue()}</p>         
        </div>
        <div className={styles.button_div}>
          <Button type="submit" onClick={handleSubmit}>
            Create Contract
          </Button>
        </div>
      </form>
    </>
  );
};

export default ContractForm;
