import { useSetRecoilState } from "recoil";
import { useState, ReactNode } from "react";
import { userState } from "../_atoms/userAtom";
import { ContractBody, User } from "../_lib/types";
import { formatDate, formatNumberToDollars } from "../_utils/helpers/helpers";
import { updateContractStatus, deleteContract } from "../_utils/api/contracts";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import styles from "./contractCard.module.css";
import RejectTextForm from "./forms/RejectTextForm";

interface ContractCardProps {
  contract: ContractBody;
  user: User;
}

const ContractCard = ({ contract, user }: ContractCardProps) => {
  const setUser = useSetRecoilState(userState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [modalTitle, setModalTitle] = useState<string>("");

  const changeContractStatus = async (newStatus: string) => {
    let previousUser: User | null = null;

    setUser((prevUser) => {
      if (!prevUser) return null;

      previousUser = prevUser;

      return {
        ...prevUser,
        contracts: prevUser.contracts.map((c) =>
          c._id === contract._id ? { ...c, status: newStatus } : c
        ),
      };
    });

    try {
      await updateContractStatus(contract._id, newStatus);
      console.log(`Contract status updated to "${newStatus}" successfully!`);
    } catch (error) {
      console.error(`Error updating contract status to "${newStatus}":`, error);
      if (previousUser) {
        setUser(previousUser);
      }
    }
  };

  const openModal = (title: string, content: ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalContent(null);
  };

  const reviseContract = async () => {
    console.log("Revising Contract!");
  };

  const handleDeleteContract = async () => {
    let previousUser: User | null = null;

    setUser((prevUser) => {
      if (!prevUser) return null;

      previousUser = prevUser;

      // Optimistically remove the contract from the user's contracts list
      return {
        ...prevUser,
        contracts: prevUser.contracts.filter((c) => c._id !== contract._id),
      };
    });

    try {
      await deleteContract(contract._id, user._id);
      console.log("Contract deleted successfully!");
    } catch (error) {
      console.error("Error deleting contract:", error);

      // Rollback to the previous user state if deletion fails
      if (previousUser) {
        setUser(previousUser);
      }
    }
  };

  const buttonsToShow = (): JSX.Element[] => {
    const buttons: JSX.Element[] = [];
    const isClient = contract.client._id === user._id;
    const isWorker = contract.worker._id === user._id;

    switch (contract.status) {
      case "Draft - Awaiting Client Approval":
        if (isClient) {
          buttons.push(
            <Button
              key="approve"
              type="button"
              onClick={() =>
                changeContractStatus(
                  "Approved by Client - Awaiting Work Completion"
                )
              }
            >
              Approve
            </Button>,
            <Button
              key="reject"
              type="button"
              onClick={() => {
                openModal(
                  "Provide Feedback",
                  <RejectTextForm contractId={contract._id} closeModal={closeModal} />
                );

                changeContractStatus("Rejected by Client - Awaiting Revision");
              }}
            >
              Reject
            </Button>
          );
        }
        if (isWorker) {
          buttons.push(
            <Button key="delete" type="button" onClick={handleDeleteContract}>
              Delete Contract
            </Button>
          );
        }
        break;
      case "Work Completed - Awaiting Payment":
        if (isClient) {
          buttons.push(
            <Button
              key="payment"
              type="button"
              onClick={() => changeContractStatus("Paid")}
            >
              Make Payment
            </Button>
          );
        }
        break;
      case "Approved by Client - Awaiting Work Completion":
        if (isWorker) {
          buttons.push(
            <Button
              key="complete"
              type="button"
              onClick={() =>
                changeContractStatus("Work Completed - Awaiting Payment")
              }
            >
              Complete Job
            </Button>
          );
        }
        break;
      case "Rejected by Client - Awaiting Revision":
        if (isWorker) {
          buttons.push(
            <Button
              key="revise"
              type="button"
              onClick={() => {
                changeContractStatus("Revised - Awaiting Client Approval");
                reviseContract();
              }}
            >
              Revise Contract
            </Button>,
            <Button key="delete" type="button" onClick={handleDeleteContract}>
              Delete Contract
            </Button>
          );
        }
        break;
      case "Paid":
        if (isWorker) {
          buttons.push(
            <Button
              key="delete"
              type="button"
              onClick={() =>
                changeContractStatus("Archived - Work Completed, Paid in Full")
              }
            >
              Archive Contract
            </Button>
          );
        }
      default:
        break;
    }
    return buttons;
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
      {buttonsToShow()}
      {isModalOpen && (
        <Modal onClose={closeModal} title={modalTitle} content={modalContent} />
      )}
    </div>
  );
};

export default ContractCard;
