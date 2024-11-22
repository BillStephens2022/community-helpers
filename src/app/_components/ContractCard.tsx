import { useRecoilValue, useSetRecoilState } from "recoil";
import { useState, ReactNode } from "react";
import { CldImage } from "next-cloudinary";
import { userContractsState, userState } from "../_atoms/userAtom";
import { ContractBody, User } from "../_lib/types";
import { formatDate, formatNumberToDollars } from "../_utils/helpers/helpers";
import { updateContractStatus, deleteContract } from "../_utils/api/contracts";
import { updateWalletBalance } from "../_utils/api/users";
import Modal from "./ui/Modal";
import styles from "./contractCard.module.css";
import RejectTextForm from "./forms/RejectTextForm";
import ContractForm from "./forms/ContractForm";
import LegalContract from "./LegalContract";
import CardButton from "./ui/CardButton";

interface ContractCardProps {
  contract: ContractBody;
}

const ContractCard = ({ contract }: ContractCardProps) => {
  const user = useRecoilValue(userState);
  const userContracts = useRecoilValue(userContractsState);
  const setContracts = useSetRecoilState(userContractsState);
  const setUser = useSetRecoilState(userState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [modalTitle, setModalTitle] = useState<string>("");

  const changeContractStatus = async (newStatus: string): Promise<void> => {
    setContracts((prevContracts) =>
      prevContracts.map((c) =>
        c._id === contract._id ? { ...c, status: newStatus } : c
      )
    );

    try {
      await updateContractStatus(contract._id, newStatus);
    } catch (error) {
      console.error(`Error updating contract status to "${newStatus}":`, error);
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

  const handleDeleteContract = async () => {
    setContracts((prevContracts) =>
      prevContracts.filter((c) => c._id !== contract._id)
    );

    try {
      await deleteContract(contract._id, user?._id);
    } catch (error) {
      console.error("Error deleting contract:", error);
    }
  };

  const handleMakePayment = async (
    clientId: string,
    workerId: string,
    contractId: string,
    amount: number
  ) => {
    // Save original states for rollback if needed
    const originalUserContracts = [...userContracts];
    const originalUser = { ...user } as User;

    // Update the contract status to "Paid" and update the client's and worker's wallet balances
    try {
      // Update the user contract state optimistically
      setContracts((prevContracts) =>
        prevContracts.map((c) =>
          c._id === contractId
            ? { ...c, status: "Work Completed, Paid in Full" }
            : c
        )
      );
      // Update the user wallet balance optimistically
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        return {
          ...prevUser,
          walletBalance: prevUser.walletBalance - amount,
        };
      });

      // Update the contract status to "Paid"
      await updateContractStatus(contractId, "Work Completed, Paid in Full");
      // Update the client's wallet balance
      await updateWalletBalance(clientId, amount, "subtract");
      // Update the worker's wallet balance
      await updateWalletBalance(workerId, amount, "add");
    } catch (error) {
      console.error("Error making payment for contract:", error);
      // Roll back to the original states if an error occurs
      setContracts(originalUserContracts);
      setUser(originalUser);
    }
  };

  const isClient = contract.client._id === user?._id;
  const isWorker = contract.worker._id === user?._id;

  const buttonsToShow = (): JSX.Element[] => {
    const buttons: JSX.Element[] = [];

    switch (contract.status) {
      case "Draft - Awaiting Client Approval":
        if (isClient) {
          buttons.push(
            <CardButton
              key="approve"
              type="button"
              primaryColor="steelblue"
              secondaryColor="var(--lightblue-primary)"
              onClick={() =>
                changeContractStatus(
                  "Approved by Client - Awaiting Work Completion"
                )
              }
            >
              Approve
            </CardButton>,
            <CardButton
              key="reject"
              type="button"
              primaryColor="steelblue"
              secondaryColor="var(--lightblue-primary)"
              onClick={() => {
                openModal(
                  "Provide Feedback",
                  <RejectTextForm
                    contractId={contract._id}
                    closeModal={closeModal}
                  />
                );
              }}
            >
              Reject
            </CardButton>
          );
        }
        if (isWorker) {
          buttons.push(
            <CardButton
              key="delete"
              type="button"
              onClick={handleDeleteContract}
            >
              Delete
            </CardButton>
          );
        }
        break;
      case "Rejected by Client - Awaiting Revision":
        if (isWorker) {
          buttons.push(
            <CardButton
              key="revise"
              type="button"
              onClick={() => {
                openModal(
                  "Provide Feedback",
                  <ContractForm closeModal={closeModal} contract={contract} />
                );
              }}
            >
              Revise
            </CardButton>,
            <CardButton
              key="delete"
              type="button"
              onClick={handleDeleteContract}
            >
              Delete
            </CardButton>
          );
        }
        break;
      case "Revised - Awaiting Client Approval":
        if (isClient) {
          buttons.push(
            <CardButton
              key="approve"
              type="button"
              onClick={() =>
                changeContractStatus(
                  "Approved by Client - Awaiting Work Completion"
                )
              }
            >
              Approve
            </CardButton>,
            <CardButton
              key="reject"
              type="button"
              onClick={() => {
                openModal(
                  "Provide Feedback",
                  <RejectTextForm
                    contractId={contract._id}
                    closeModal={closeModal}
                  />
                );
              }}
            >
              Reject
            </CardButton>
          );
        }
        break;
      case "Work Completed - Awaiting Payment":
        if (isClient) {
          buttons.push(
            <CardButton
              key="payment"
              type="button"
              onClick={() =>
                handleMakePayment(
                  contract.client._id,
                  contract.worker._id,
                  contract._id,
                  contract.amountDue
                )
              }
            >
              Make Payment
            </CardButton>
          );
        }
        break;
      case "Approved by Client - Awaiting Work Completion":
        if (isWorker) {
          buttons.push(
            <CardButton
              key="complete"
              type="button"
              onClick={() =>
                changeContractStatus("Work Completed - Awaiting Payment")
              }
            >
              Complete Job
            </CardButton>
          );
        }
        break;
      case "Paid":
        if (isWorker) {
          buttons.push(
            <CardButton
              key="delete"
              type="button"
              onClick={() =>
                changeContractStatus("Archived - Work Completed, Paid in Full")
              }
            >
              Archive Contract
            </CardButton>
          );
        }
      default:
        break;
    }
    return buttons;
  };

  const viewLegalContract = () => {
    openModal("Legal Contract", <LegalContract contract={contract} />);
  };

  return (
    <>
      <div key={contract._id} className={styles.contract_card}>
        <div className={styles.contract_card_header}>
          <h2 className={styles.contract_card_h2_category}>
            {contract.jobCategory}
          </h2>
        </div>
        <div className={styles.contract_card_body}>
          <div className={styles.contract_card_people}>
            <div className={styles.contract_card_worker}>
              <h2 className={styles.contract_card_h2}>
                Worker: {contract.worker.firstName} {contract.worker.lastName}
              </h2>
              {contract.worker.profileImage && (
                <CldImage
                  src={contract.worker.profileImage}
                  alt="worker's profile image"
                  radius={50}
                  width={50}
                  height={50}
                  crop={{ type: "thumb", gravity: "face" }}
                  className={styles.profileImage}
                />
              )}
            </div>
            <div className={styles.contract_card_client}>
              <h2 className={styles.contract_card_h2}>
                Client: {contract.client.firstName} {contract.client.lastName}
              </h2>
              {contract.client.profileImage && (
                <CldImage
                  src={contract.client.profileImage}
                  alt="client's profile image"
                  radius={50}
                  width={50}
                  height={50}
                  crop={{ type: "thumb", gravity: "face" }}
                  className={styles.profileImage}
                />
              )}
            </div>
          </div>
          <div className={styles.contract_card_terms}>
            <div className={styles.contrace_card_terms_top}>
              <p className={styles.contract_card_description}>
                {contract.jobDescription}
              </p>
              {contract.additionalNotes && (
                <p className={styles.contract_card_p}>
                  Job Notes: {contract.additionalNotes}
                </p>
              )}
              <p className={styles.contract_card_p}>
                Fee Type: {contract.feeType.toUpperCase()}
              </p>
              {contract.feeType === "hourly" && (
                <p className={styles.contract_card_p}>
                  Hourly Rate: ${contract.hourlyRate} per hour
                </p>
              )}
              {contract.feeType === "hourly" && (
                <p className={styles.contract_card_p}>
                  Estimated Hours: {contract.hours} hours
                </p>
              )}
              {contract.feeType === "fixed" && (
                <p className={styles.contract_card_p}>
                  Fixed Fee:{" "}
                  {contract.fixedRate &&
                    formatNumberToDollars(contract.fixedRate)}
                </p>
              )}
              <p className={styles.contract_card_p}>
                Status: {contract.status}
              </p>
              {contract.status === "Rejected by Client - Awaiting Revision" &&
                contract.rejectionText && (
                  <p className={styles.contract_card_p}>
                    Rejection Feedback: {contract.rejectionText}
                  </p>
                )}
              <p className={styles.contract_card_p}>
                Created: {formatDate(contract.createdAt)}
              </p>
            </div>
            <div className={styles.contrace_card_terms_bottom}>
              <h2 className={styles.contract_card_amount_due}>
                Amount Due upon completion:{" "}
                {formatNumberToDollars(contract.amountDue)}
              </h2>
            </div>
          </div>
        </div>
        <div className={styles.contract_card_footer}>
          {buttonsToShow()}
          <CardButton
            type="button"
            onClick={viewLegalContract}
            primaryColor="steelblue"
            secondaryColor="var(--lightblue-primary)"
          >
            View Contract
          </CardButton>
        </div>
      </div>
      {isModalOpen && (
        <Modal onClose={closeModal} title={modalTitle} content={modalContent} />
      )}
    </>
  );
};

export default ContractCard;
