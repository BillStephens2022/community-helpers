import React from "react";
import { ContractBody } from "../_lib/types";
import styles from "./legalContract.module.css";

interface LegalContractProps {
  contract: ContractBody;
}

const LegalContract: React.FC<LegalContractProps> = ({ contract }) => {
  const {
    worker,
    client,
    jobCategory,
    jobDescription,
    feeType,
    hourlyRate,
    hours,
    fixedRate,
    amountDue,
    additionalNotes,
    status,
    createdAt,
  } = contract;

  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <div className={styles.legalContract_div}>
      <h1 className={styles.legalContract_h1}>Legal Contract</h1>
      <div className={styles.legalContract_body}>
      <p className={styles.legalContract_p}>
        Be it known to all who peruse this most solemn document, on this auspicious day of{" "}
        <strong>{formattedDate}</strong>, the following binding agreement has been executed with
        the utmost seriousness (and just a hint of bureaucratic flair) between the honorable{" "}
        <strong>{worker.firstName} {worker.lastName}</strong>, hereinafter referred to as
        &quot;The Esteemed Worker,&quot; and the illustrious{" "}
        <strong>{client.firstName} {client.lastName}</strong>, henceforth known as &quot;The Noble
        Client.&quot;
      </p>
      <p className={styles.legalContract_p}>
        <strong>Whereas:</strong> The Worker possesses skills in the realm of{" "}
        <strong>{jobCategory}</strong>, and has graciously consented to render such services to
        the Client in accordance with the sacred principles of professionalism, punctuality, and,
        when applicable, caffeination.
      </p>
      <p className={styles.legalContract_p}>
        <strong>And Whereas:</strong> The Client, possessing both vision and a valid bank
        account, has undertaken to compensate the Worker for their time, effort, and occasional
        sighs of frustration as described below:
      </p>
      <p className={styles.legalContract_p}>
        <strong>Job Description:</strong> {jobDescription}
      </p>
      <p className={styles.legalContract_p}>
        <strong>Compensation:</strong>{" "}
        {feeType === "hourly" ? (
          <>
            An hourly rate of <strong>${hourlyRate?.toFixed(2)}</strong>, for a projected total of{" "}
            <strong>{hours}</strong> hours, with payment contingent upon services rendered and the
            alignment of the stars.
          </>
        ) : (
          <>
            A fixed rate of <strong>${fixedRate?.toFixed(2)}</strong>, to be paid in a lump sum,
            subject to the successful completion of the work, and barring any unforeseen zombie
            apocalypses.
          </>
        )}
      </p>
      <p className={styles.legalContract_p}>
        <strong>Total Amount Due:</strong> <strong>${amountDue.toFixed(2)}</strong> (or whatever
        loose change the Client can find under their couch cushions).
      </p>
      {additionalNotes && (
        <p className={styles.legalContract_p}>
          <strong>Additional Provisions and Annotations:</strong> {additionalNotes}
        </p>
      )}
      <p className={styles.legalContract_p}>
        <strong>Status of this Agreement:</strong> {status}. Please note: any attempt to dispute
        this status will require a formal petition, signed in triplicate, and submitted to the
        Department of Contractual Quandaries.
      </p>
      <p className={styles.legalContract_p}>
        <strong>Mutual Acknowledgment:</strong> Both parties hereby agree to uphold the terms set
        forth in this document, under penalty of mildly stern glares, and do so with full
        awareness of the serious (yet slightly ridiculous) tone of this agreement.
      </p>
      <p className={styles.legalContract_p}>
        Signed with utmost sincerity and a touch of dramatic flair by: <br />
        <strong>{worker.firstName} {worker.lastName}</strong> (Worker) <br />
        <strong>{client.firstName} {client.lastName}</strong> (Client)
      </p>
      <p className={styles.legalContract_p}>
        This contract is not legally binding and is provided for entertainment purposes only.
        Please consult a qualified legal professional for actual contractual agreements.
      </p>
      </div>
    </div>
  );
};

export default LegalContract;
