import { FC, useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
} from "react-native";
import { dark, gray, main, w400, w500 } from "../constants";
import UserContext from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import axios from "../axios";
import SocketContext from "../context/SocketContext";
import Button from "../components/Button";
import SubscriptionContext from "../context/SubscriptionContext";
import SetSubscription from "../context/SetSubscription";

type Bank = {
  name: string;
  logo: string;
  link: string;
  description: string;
};

const { width } = Dimensions.get("window");

const NoSubscription: FC = () => {
  const [banks, setBanks] = useState<Bank[] | null>(null);
  const userContext = useContext(UserContext);
  const setSubscription = useContext(SetSubscription);
  const socket = useContext(SocketContext);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const result = await userContext?.userInfo();

      if (!result) {
        userContext?.setStatus(false);
      } else {
        socket?.on(`payment-${result._id}`, async () => {
          if (setSubscription) setSubscription(true);
          navigation.navigate("Нүүр хуудас" as any);
        });
      }
    })();
  }, []);

  const getSubscription = async () => {
    const response = (await axios.post("/user/subscription")).data;
    if (response.success) {
      setBanks(response.result);
    }
  };

  return (
    <View>
      {banks ? (
        <View>
          {banks
            .filter((bank) => {
              if (
                !bank.description.toLowerCase().includes("үндэсний") &&
                !bank.description.toLowerCase().includes("тээвэр")
              ) {
                return true;
              } else {
                return false;
              }
            })
            .map((bank) => (
              <TouchableOpacity
                key={bank.logo}
                activeOpacity={0.6}
                style={{
                  flexDirection: "row",
                  marginBottom: 10,
                  paddingBottom: 10,
                  alignItems: "center",
                  width: width / 1.4,
                  borderBottomColor: "#ddd",
                  borderBottomWidth: 1,
                }}
                onPress={() => Linking.openURL(bank.link)}
              >
                <Image
                  source={{ uri: bank.logo }}
                  style={{ width: 35, height: 35, borderRadius: 5 }}
                />
                <Text
                  style={{
                    textTransform: "uppercase",
                    fontFamily: w400,
                    marginLeft: 10,
                  }}
                >
                  {bank.description}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      ) : (
        <>
          <Text style={css.title}>Та эрх авч байж хандах боломжтой. </Text>
          <Text style={css.header}>1 жилийн эрх: 15000₮</Text>
          <Button style={{ marginTop: 15 }} onPress={getSubscription}>
            Төлбөр төлөх
          </Button>
        </>
      )}
    </View>
  );
};

export default NoSubscription;

const css = StyleSheet.create({
  title: {
    fontFamily: w500,
    textTransform: "uppercase",
    color: main,
    fontSize: 18,
    textAlign: "center",
  },
  header: {
    textAlign: "center",
    color: dark,
    fontFamily: w500,
    fontSize: 20,
    marginTop: 15,
  },
  subtext: {
    textAlign: "center",
    color: gray,
    fontFamily: w500,
    fontSize: 14,
    textTransform: "uppercase",
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  text: {
    color: dark,
    fontFamily: w400,
    fontSize: 16,
    textTransform: "uppercase",
  },
  span: {
    color: main,
    fontFamily: w400,
    fontSize: 16,
    textTransform: "uppercase",
  },
});
