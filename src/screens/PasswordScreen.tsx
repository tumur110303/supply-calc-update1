import { FC, useEffect, useState } from "react";
import { View, StyleSheet, Text, Alert, ActivityIndicator } from "react-native";
import Button from "../components/Button";
import axios from "../axios";
import Textfield from "../components/Textfield";
import { dark, main, w500 } from "../constants";
import { useNavigation } from "@react-navigation/native";

const PasswordScreen: FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [mail, setMail] = useState("");
  const send = async () => {
    try {
      const user = (await axios.get(`/user?email=${mail}`)).data;
      console.log(user);
      if (user.result[0]) {
        setLoading(true);
        await axios.post("/user/verification", { id: user.result[0]._id });
        setLoading(false);
        Alert.alert("Имэйл рүү баталгаажуулах код илгээлээ");
        navigation.navigate(
          "Баталгаажуулах" as never,
          {
            id: user.result[0]._id,
            from: "password",
          } as never
        );
      } else {
        Alert.alert("Имэйл олдсонгүй");
      }
    } catch (error: any) {
      console.log(error.response);
      Alert.alert("Имэйл илгээхэд алдаа гарлаа.");
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <>
      <View style={{ marginVertical: 25, marginHorizontal: 15, flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            textTransform: "uppercase",
            fontFamily: w500,
            color: dark,
            marginBottom: 5,
          }}
        >
          Таны э мэйл
        </Text>
        <Textfield
          keyboardType="email-address"
          onChangeText={setMail}
          value={mail}
          icon="email"
          placeholder="****@gmail.com"
        />
        <Button onPress={send}>баталгаажуулах</Button>
      </View>
      {loading && (
        <View style={css.indicatorContainer}>
          <ActivityIndicator style={css.indicator} size="large" color={main} />
        </View>
      )}
    </>
  );
};

export default PasswordScreen;

const css = StyleSheet.create({
  indicatorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  indicator: {
    transform: [{ scale: 1.5 }],
  },
});
