import React from 'react';
import { ContractBody } from '../_lib/types';

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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
      <h1 style={{ textAlign: 'center' }}>Legal Contract</h1>
      <p>
        This contract is entered into as of <strong>{formattedDate}</strong>, between{' '}
        <strong>{worker.firstName} {worker.lastName}</strong> (the "Worker") and <strong>{client.firstName} {client.lastName}</strong> (the
        "Client").
      </p>
      <p>
        <strong>Job Category:</strong> {jobCategory}
      </p>
      <p>
        <strong>Job Description:</strong> {jobDescription}
      </p>
      <p>
        <strong>Fee Structure:</strong>{' '}
        {feeType === 'hourly'
          ? `Hourly Rate: $${hourlyRate?.toFixed(2)} for ${hours} hours`
          : `Fixed Rate: $${fixedRate?.toFixed(2)}`}
      </p>
      <p>
        <strong>Total Amount Due:</strong> ${amountDue.toFixed(2)}
      </p>
      {additionalNotes && (
        <p>
          <strong>Additional Notes:</strong> {additionalNotes}
        </p>
      )}
      <p>
        <strong>Contract Status:</strong> {status}
      </p>
      <p>
        Both parties agree to the terms outlined above and acknowledge their understanding and
        acceptance of this contract.
      </p>
      <p>
        Signed by: <strong>{worker.firstName} {worker.lastName}</strong> (Worker) and <strong>{client.firstName} {client.lastName}</strong>{' '}
        (Client).
      </p>
    </div>
  );
};

export default LegalContract;