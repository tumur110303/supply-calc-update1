import { FC, useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import UserContext from "./context/UserContext";
import axios from "./axios";
import { io } from "socket.io-client";
import SocketContext from "./context/SocketContext";
import SubscriptionContext from "./context/SubscriptionContext";
import CountContext from "./context/CountContext";
import SetSubscription from "./context/SetSubscription";
import SetCount from "./context/SetCount";

const socket = io("http://13.250.116.121:8000/");

const Container: FC = ({ children }) => {
  const [subscription, setSubscription] = useState(false);
  const [count, setCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const userContext = useContext(UserContext);

  useEffect(() => {
    (async () => {
      const result = await userContext?.userInfo();

      if (!result) {
        userContext?.setStatus(false);
      } else {
        const deviceId = await AsyncStorage.getItem("device-id");
        setUser(result);
        if (result.subscription) {
          setSubscription(true);
        } else {
          setSubscription(false);
        }
        setCount(result.count);
        socket.on(`transaction-${result._id}`, () => {
          setSubscription(true);
        });
        if (result.device_id !== "" && result.device_id !== deviceId) {
          await axios.post("/logout");
          userContext?.setStatus(false);
        } else {
          userContext?.setStatus(true);
        }
      }
    })();
  }, []);

  return (
    <>
      <SetSubscription.Provider value={setSubscription}>
        <SetCount.Provider value={setCount}>
          <SubscriptionContext.Provider value={subscription}>
            <CountContext.Provider
              value={{
                count,
                increase: async () => {
                  setCount((state) => state + 1);
                  await axios.post("/user/count", { id: user._id });
                },
              }}
            >
              <SocketContext.Provider value={socket}>
                {children}
              </SocketContext.Provider>
            </CountContext.Provider>
          </SubscriptionContext.Provider>
        </SetCount.Provider>
      </SetSubscription.Provider>
    </>
  );
};

export default Container;

const css = StyleSheet.create({});
