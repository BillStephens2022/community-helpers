"use client"; // This ensures the component is treated as a client component

import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";

interface ClientLayoutProps {
  session: any;
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ session, children }) => {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        {children}
      </RecoilRoot>
    </SessionProvider>
  );
};

export default ClientLayout;