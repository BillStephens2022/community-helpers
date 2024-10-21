import { ContractBody, User } from "../_lib/types";
import styles from "./contractsContent.module.css";

interface ContractCardProps {
  contract: ContractBody;
}

const ContractCard = ({ contract }: ContractCardProps) => {
  return (
    <div key={contract._id} className={styles.contract_card}>
      <h2>Worker: {contract.worker.firstName} {contract.worker.lastName}</h2>
      <h2>Client: {contract.client.firstName} {contract.client.lastName}</h2>
      <h2>Job Category: {contract.jobCategory}</h2>
      <p>Job Description: {contract.jobDescription}</p>
      {contract.additionalNotes && <p>Job Notes: {contract.additionalNotes}</p>}
      <p>Fee Type: {contract.feeType}</p>
      {contract.feeType === "hourly" && <p>Hourly Rate: {contract.hourlyRate}</p>}
      {contract.feeType === "hourly" && <p>Estimated Hours: {contract.hours}</p>}
      {contract.feeType === "fixed" && <p>Fixed Fee: {contract.fixedRate}</p>}
      <h4>Amount Due upon completion: {contract.amountDue}</h4>
      <p>Status: {contract.status}</p>
      <p>created: {contract.createdAt.toLocaleString()}</p>

    </div>
  );
};

export default ContractCard;
