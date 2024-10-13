import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSetRecoilState } from "recoil";
import { userState } from "../../_atoms/userAtom";
import { fetchUserData } from "../../_utils/api/users";

export const useProfileData = () => {
  const { data: session } = useSession();
  const setUser = useSetRecoilState(userState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        const userId = session.user.id;
        try {
          const data = await fetchUserData(userId);
          setUser({ ...data, _id: userId }); // Update Recoil state
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [session, setUser]);

  return { loading };
};