import { useSetRecoilState, useRecoilValue } from "recoil";
import { userState } from "../_atoms/userAtom";
import { User } from "../_lib/types";
import styles from "./contractsContent.module.css";
import ContractCard from "./ContractCard";


interface ContractContentProps {
  user: User;
}

const ContractContent = ({ user }: ContractContentProps) => {
  const setUser = useSetRecoilState(userState);

  
  return (
      <div>
        <h1>{user.firstName}'s Contracts</h1>
        {user.contracts.map((contract) => (
            <ContractCard key={contract._id} contract={contract} />
        ))}
      </div>
  );
};

export default ContractContent;