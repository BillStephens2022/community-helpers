import { useSetRecoilState } from "recoil";
import { userState } from "../_atoms/userAtom";
import { ContractBody, User } from "../_lib/types";
import { formatDate, formatNumberToDollars } from "../_utils/helpers/helpers";
import Button from "./ui/Button";
import styles from "./contractCard.module.css";

interface ContractCardProps {
  contract: ContractBody;
  user: User;
}

const ContractCard = ({ contract, user }: ContractCardProps) => {
  const setUser = useSetRecoilState(userState);

  const approveContract = async () => {
    let previousUser: User | null = null;
    // Optimistically update the contract status before api request
    setUser((prevUser) => {
      if (!prevUser) return null;

      // Store the previous user state for rollback purposes
      previousUser = prevUser;

      return {
        ...prevUser,
        contracts: prevUser.contracts.map((c) =>
          c._id === contract._id
            ? { ...c, status: "Approved by Client - Awaiting Work Completion" } // Optimistic update
            : c
        ),
      };
    });

    try {
      const response = await fetch(`/api/contracts/${contract._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Approved by Client - Awaiting Work Completion",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve the contract.");
      }

      console.log("Contract approved successfully!");
    } catch (error) {
      console.error("Error approving contract:", error);

      // Revert to the previous state if the API call fails
      if (previousUser) {
        setUser(previousUser);
      }
    }
  };

  return (
    <div key={contract._id} className={styles.contract_card}>
      <h2>
        Worker: {contract.worker.firstName} {contract.worker.lastName}
      </h2>
      <h2>
        Client: {contract.client.firstName} {contract.client.lastName}
      </h2>
      <h2>Job Category: {contract.jobCategory}</h2>
      <p>Job Description: {contract.jobDescription}</p>
      {contract.additionalNotes && <p>Job Notes: {contract.additionalNotes}</p>}
      <p>Fee Type: {contract.feeType.toUpperCase()}</p>
      {contract.feeType === "hourly" && (
        <p>Hourly Rate: ${contract.hourlyRate} per hour</p>
      )}
      {contract.feeType === "hourly" && (
        <p>Estimated Hours: {contract.hours} hours</p>
      )}
      {contract.feeType === "fixed" && (
        <p>
          Fixed Fee:{" "}
          {contract.fixedRate && formatNumberToDollars(contract.fixedRate)}
        </p>
      )}
      <h2>
        Amount Due upon completion: {formatNumberToDollars(contract.amountDue)}
      </h2>
      <p>Status: {contract.status}</p>
      <p>Created: {formatDate(contract.createdAt)}</p>
      {contract.client._id === user._id && (
        <Button type="button" onClick={approveContract}>
          Approve
        </Button>
      )}
    </div>
  );
};

export default ContractCard;
