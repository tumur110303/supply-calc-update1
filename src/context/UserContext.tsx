import { createContext, FC, useEffect, useState } from "react";
import axios from "../axios";

const UserContext = createContext<{
  status: boolean;
  setStatus: (state: boolean) => void;
  checkStatus: () => Promise<boolean>;
  userInfo: () => Promise<any> | null;
  subscription: boolean;
  setSubscription: (state: boolean) => void;
} | null>(null);

export const UserStore: FC = ({ children }) => {
  const [status, setStatus] = useState(false);
  const [subscription, setSubscription] = useState(false);

  const checkStatus = async () => {
    try {
      const result = (await axios.get("/user/account")).data.result;

      if (result.subscription !== null || result.subscription !== undefined) {
        setSubscription(true);
      } else {
        setSubscription(false);
      }

      setStatus(true);
      return true;
    } catch (error) {
      setStatus(false);
      return false;
    }
  };

  const userInfo = async () => {
    try {
      const result = (await axios.get("/user/account")).data;
      if (
        result.result.subscription === null ||
        result.result.subscription === undefined
      ) {
        setSubscription(false);
      } else {
        setSubscription(true);
      }
      return result.result;
    } catch (error: any) {
      console.log(error);
      setStatus(false);
      return null;
    }
  };

  return (
    <UserContext.Provider
      value={{
        status,
        setStatus,
        checkStatus,
        userInfo,
        subscription,
        setSubscription,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
