import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSetRecoilState } from "recoil";
import { userState, userContractsState } from "../../_atoms/userAtom";
import { fetchUserData, fetchUserContracts } from "../../_utils/api/users";

export const useProfileData = () => {
  const { data: session } = useSession();
  const setUser = useSetRecoilState(userState);
  const setUserContracts = useSetRecoilState(userContractsState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        const userId = session.user.id;
        try {
          const userData = await fetchUserData(userId);
          setUser(userData);
          const userContracts = await fetchUserContracts(userId); // Fetch contracts separately
          setUserContracts(userContracts);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [session, setUser, setUserContracts]);

  return { loading };
};