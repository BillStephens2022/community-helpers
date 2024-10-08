"use client"; // This ensures the component is treated as a client component

import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';

interface ClientLayoutProps {
  session: any;
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ session, children }) => {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <MantineProvider defaultColorScheme="dark">{children}</MantineProvider>
      </RecoilRoot>
    </SessionProvider>
  );
};

export default ClientLayout;
