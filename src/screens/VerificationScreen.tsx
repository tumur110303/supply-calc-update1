import { useNavigation } from "@react-navigation/native";
import { FC, useEffect, useState } from "react";
import { View, StyleSheet, Text, Alert, TouchableOpacity } from "react-native";
import axios from "../axios";
import Button from "../components/Button";
import Textfield from "../components/Textfield";
import { w400 } from "../constants";

const VerificationScreen: FC = ({ route }: any) => {
  const { id, from } = route.params;
  const navigation = useNavigation();
  const [code, setCode] = useState("");

  const verficate = async () => {
    try {
      const result = (await axios.post("/login/verification", { id, code }))
        .data.status;
      if (result) {
        Alert.alert("Амжилттай баталгаажлаа.");
        if (from === "verification") {
          navigation.navigate("Нэвтрэх" as any);
        } else {
          navigation.navigate(
            "Нууц үг солих" as never,
            {
              id,
            } as never
          );
        }
      } else {
        Alert.alert("Баталгаажуулах код буруу байна.");
        setCode("");
      }
    } catch (error: any) {
      console.log(error.response);
    }
  };
  const reSend = async () => {
    try {
      await axios.post("/user/verification", { id });
      Alert.alert("Мэйл дахин илгээлээ");
    } catch (error) {
      Alert.alert("Мэйл дахин илгээхэд алдаа гарлаа.");
    }
  };
  return (
    <View style={{ marginHorizontal: 30, marginTop: 20 }}>
      <Text
        style={{
          fontSize: 14,
          textTransform: "uppercase",
          fontFamily: w400,
          marginBottom: 5,
        }}
      >
        Имэйлээр илгээсэн баталгаажуулах кодыг оруулна уу:
      </Text>
      <Textfield
        icon="account-lock"
        placeholder="****"
        keyboardType={"number-pad"}
        value={code}
        onChangeText={(value) => setCode(value)}
      />
      <Button onPress={verficate}>баталгаажуулах</Button>
      <TouchableOpacity activeOpacity={0.5} onPress={reSend}>
        <Text
          style={{
            textAlign: "center",
            textTransform: "uppercase",
            marginTop: 10,
          }}
        >
          Дахиж илгээх
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default VerificationScreen;

const css = StyleSheet.create({});
