"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { Session } from "next-auth";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { MantineProvider } from "@mantine/core";
import { useEffect } from "react";
import { fetchUsers, fetchUserData } from "./_utils/api/users";
import { userState, usersState, usersLoadingState, userContractsState } from "./_atoms/userAtom";
import { User } from "./_lib/types";
import "@mantine/core/styles.css";

interface ClientLayoutProps {
  session: Session | null;
  children: React.ReactNode;
}

const DataInitializer: React.FC = () => {
  const setUser = useSetRecoilState(userState);
  const setUsers = useSetRecoilState(usersState);
  const setUserContracts = useSetRecoilState(userContractsState);
  const setLoading = useSetRecoilState(usersLoadingState);
  const { data: session } = useSession();

  // central data fetching and initialization / state setting
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        const users: User[] = await fetchUsers();
        setUsers(users);
        const loggedInUser = users.find(user => user.email === session?.user?.email);
        if (loggedInUser) {
          // Fetch complete user data for the logged-in user
          const fullUserData = await fetchUserData(loggedInUser._id);
          setUser(fullUserData);
          setUserContracts(fullUserData.contracts);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [setUsers, setUser, setLoading, session]);

  return null;
};

const ClientLayout: React.FC<ClientLayoutProps> = ({ session, children }) => {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <DataInitializer />
        <MantineProvider defaultColorScheme="dark">{children}</MantineProvider>
      </RecoilRoot>
    </SessionProvider>
  );
};

export default ClientLayout;
