import { ContractBody, User } from "../_lib/types";
import { formatDate, formatNumberToDollars } from "../_utils/helpers/helpers";
import Button from "./ui/Button";
import styles from "./contractCard.module.css";

interface ContractCardProps {
  contract: ContractBody;
  user: User;
}

const ContractCard = ({ contract, user }: ContractCardProps) => {
  return (
    <div key={contract._id} className={styles.contract_card}>
      <h2>Worker: {contract.worker.firstName} {contract.worker.lastName}</h2>
      <h2>Client: {contract.client.firstName} {contract.client.lastName}</h2>
      <h2>Job Category: {contract.jobCategory}</h2>
      <p>Job Description: {contract.jobDescription}</p>
      {contract.additionalNotes && <p>Job Notes: {contract.additionalNotes}</p>}
      <p>Fee Type: {contract.feeType.toUpperCase()}</p>
      {contract.feeType === "hourly" && <p>Hourly Rate: ${contract.hourlyRate} per hour</p>}
      {contract.feeType === "hourly" && <p>Estimated Hours: {contract.hours} hours</p>}
      {contract.feeType === "fixed" && <p>Fixed Fee: {contract.fixedRate && formatNumberToDollars(contract.fixedRate)}</p>}
      <h2>Amount Due upon completion: {formatNumberToDollars(contract.amountDue)}</h2>
      <p>Status: {contract.status}</p>
      <p>Created: {formatDate(contract.createdAt)}</p>
      {contract.client._id === user._id && (<Button type="button" onClick={() => console.log("CONTRACT APPROVED!")}>Approve</Button>)}
    </div>
  );
};

export default ContractCard;
