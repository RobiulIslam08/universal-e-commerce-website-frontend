"use client";

import UserProvider from "@/context/UserContext";
import { SessionProvider } from "next-auth/react";
import StoreProvider from "./StoreProvider";
// import StoreProvider from "./StoreProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <SessionProvider>
        
        <StoreProvider>{children}</StoreProvider>
      </SessionProvider>
    </UserProvider>
  );
};

export default Providers;
