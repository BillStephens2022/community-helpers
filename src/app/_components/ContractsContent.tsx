import { User } from "../_lib/types";
import ContractCard from "./ContractCard";
import styles from "./contractsContent.module.css";


interface ContractContentProps {
  user: User;
}

const ContractContent = ({ user }: ContractContentProps) => {
  return (
      <div className={styles.contracts_content}>
        <h1 className={styles.contracts_content_header}>{user.firstName}'s Contracts</h1>
        <div className={styles.contracts_cards}>
        {user.contracts.map((contract) => (
            <ContractCard key={contract._id} contract={contract} user={user} />
        ))}
        </div>
      </div>
  );
};

export default ContractContent;