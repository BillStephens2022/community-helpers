import { useRecoilValue } from "recoil";
import { userContractsState } from "../_atoms/userAtom";
import ContractCard from "./ContractCard";
import styles from "./contractsContent.module.css";


const ContractContent = () => {
  const contracts = useRecoilValue(userContractsState);
  console.log(contracts);
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