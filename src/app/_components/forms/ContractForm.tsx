"use client";
import { v4 as uuidv4 } from "uuid";
import { useState, FormEvent } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { ContractBody } from "../../_lib/types";
import { userContractsState, usersState } from "../../_atoms/userAtom";
import { userState } from "../../_atoms/userAtom";
import { createContract } from "../../_utils/api/contracts";
import Button from "../ui/Button";
import { skillsetOptions } from "../../_lib/constants";
import styles from "./sendMessageForm.module.css";

interface ContractFormProps {
  closeModal: () => void;
  loggedInUserId?: string;
  loggedInUsername?: string;
  clientId?: string;
  contract?: ContractBody;
}

const ContractForm = ({
  closeModal,
  loggedInUserId,
  loggedInUsername,
  clientId,
  contract,
}: ContractFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const users = useRecoilValue(usersState);
  const user = useRecoilValue(userState);
  const setUserContracts = useSetRecoilState(userContractsState);
  const setUser = useSetRecoilState(userState);

  const initialFormData = contract
    ? {
        client: contract.client._id,
        worker: contract.worker._id,
        jobCategory: contract.jobCategory,
        jobDescription: contract.jobDescription,
        feeType: contract.feeType,
        hourlyRate: contract.hourlyRate?.toString() || "",
        hours: contract.hours?.toString() || "",
        fixedRate: contract.fixedRate?.toString() || "",
        additionalNotes: contract.additionalNotes || "",
      }
    : {
        client: clientId || "",
        worker: loggedInUserId || "",
        jobCategory: user?.skillset || "",
        jobDescription: "",
        feeType: "hourly",
        hourlyRate: "",
        hours: "",
        fixedRate: "",
        additionalNotes: "",
      };

  const [formData, setFormData] = useState(initialFormData);

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
    if (loggedInUserId === formData.client) {
      newErrors.client = "Worker and Client cannot be the same user.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateAmountDue = () => {
    if (formData.feeType === "hourly") {
      return Number(formData.hourlyRate) * Number(formData.hours) || 0;
    }
    return Number(formData.fixedRate) || 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // placeholder until functionality is built to edit the contract, returns early if contract is being edited
    if (contract) {
      console.log("editing contract!")
      closeModal();
      return;
    }

    if (!validateFields()) return;

    const amountDue = calculateAmountDue();

    // Get client and worker details
    const client = users.find((u) => u._id === formData.client);
    const worker = users.find((u) => u._id === formData.worker);

    // Select only the required properties
    const clientUser = client
      ? {
          _id: client._id,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          profileImage: client.profileImage,
        }
      : null;

    const workerUser = worker
      ? {
          _id: worker._id,
          firstName: worker.firstName,
          lastName: worker.lastName,
          email: worker.email,
          profileImage: worker.profileImage,
        }
      : null;

    const contractData = {
      worker: formData.worker,
      client: formData.client,
      jobCategory: formData.jobCategory,
      jobDescription: formData.jobDescription,
      feeType: formData.feeType,
      hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : undefined,
      hours: formData.hours ? Number(formData.hours) : undefined,
      fixedRate: formData.fixedRate ? Number(formData.fixedRate) : undefined,
      amountDue,
      additionalNotes: formData.additionalNotes,
      status: "Draft - Awaiting Client Approval",
    };

    // Optimistically update the state
    const optimisticContract = {
      ...contractData,
      id: uuidv4(), // Generate a unique temporary ID
      client: clientUser, // contains firstName, lastName, etc
      worker: workerUser, // contains firstname, lastName, etc
      createdAt: new Date().toISOString(),
    } as unknown as ContractBody; // Double casting to bypass the strict type check, since the ID is temporary

    setUserContracts((prev) => [...prev, optimisticContract]);

    try {
      const newContract = await createContract(contractData);
      // Add the additional user details to newContract before updating the state
      const populatedNewContract = {
        ...newContract,
        client: clientUser!,
        worker: workerUser!,
      };
      // Replace the optimistic contract with the actual contract from the server
      setUserContracts((prev) =>
        prev.map((contract) =>
          contract._id === optimisticContract._id
            ? populatedNewContract
            : contract
        )
      );
      setFormData(initialFormData);
      closeModal();
    } catch (error: any) {
      console.error("An error occurred: ", error);
      const apiErrors = JSON.parse(error.message) as Record<string, string>;
      setErrors(apiErrors);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.static_field}>
          <label className={styles.label}>Worker:</label>
          <p className={styles.form_p1}>
            {contract
              ? `${contract.worker.firstName} ${contract.worker.lastName}`
              : `${loggedInUsername}`}
          </p>
        </div>
        <div className={styles.static_field}>
          <label className={styles.label}>Client:</label>
          <select
            name="client"
            id="client"
            value={formData.client}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="">Select a client</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="jobCategory" className={styles.label}>
            Job Category
          </label>
          <select
            name="jobCategory"
            className={styles.input}
            id="jobCategory"
            onChange={handleChange}
            value={formData.jobCategory}
          >
            <option value="">Select a job category</option>
            {skillsetOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
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
            {contract ? "Submit Changes" : "Create Contract"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ContractForm;
