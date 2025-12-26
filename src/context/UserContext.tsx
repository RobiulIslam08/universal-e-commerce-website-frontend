"use client";

import { getCurrentUser } from "@/services/auth";
import { IUser } from "@/types/user";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
interface IUserProviderValues {
  user: IUser | null;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const UserContext = createContext<IUserProviderValues | undefined>(undefined);
const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const handleUser = async () => {
    const user = await getCurrentUser();
    if (user) {
      // Map DecodedUser to IUser
      setUser({
        id: user.userId,
        name: user.name,
        email: user.email,
        role: user.role as "user" | "admin",
        avatar: user.image,
        isActive: true,
      });
    } else {
      setUser(null);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleUser();
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('"useUser must be used within the UserProvider context"');
  }
  return context;
};
export default UserProvider;
