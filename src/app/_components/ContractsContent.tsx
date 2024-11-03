import { ContractBody, User } from "../_lib/types";
import ContractCard from "./ContractCard";
import styles from "./contractsContent.module.css";


interface ContractContentProps {
  contracts: ContractBody[];
}

const ContractContent = ({ contracts }: ContractContentProps) => {
  return (
      <div className={styles.contracts_content}>
        <h1 className={styles.contracts_content_header}>Your Contracts</h1>
        <div className={styles.contracts_cards}>
        {contracts.map((contract) => (
            <ContractCard key={contract._id} contract={contract} />
        ))}
        </div>
      </div>
  );
};

export default ContractContent;