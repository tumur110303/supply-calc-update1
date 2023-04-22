import { useNavigation } from "@react-navigation/native";
import { FC, useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import axios from "../../axios";
import Button from "../../components/Button";
import Textfield from "../../components/Textfield";

const ChangePassword: FC = ({ route }: any) => {
  const { id } = route.params;
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const changePassword = async () => {
    try {
      await axios.post(`/user/${id}/password`, {
        password: password.toLowerCase(),
      });
      Alert.alert("Нууц үг солигдлоо.");
      navigation.navigate("Нэвтрэх" as any);
    } catch (error: any) {
      console.log(error.response);
      Alert.alert("Алдаа!");
    }
  };

  return (
    <View style={{ marginHorizontal: 30, marginTop: 20 }}>
      <Textfield
        label="Шинэ нууц үг"
        icon="lock"
        placeholder="****"
        secure
        value={password}
        onChangeText={setPassword}
        error={{
          text: (() => {
            let errorText = "Алдаа!";
            if (password.length < 8) {
              errorText = "Нууц үг хэтэрхий богинохон байна.";
            }
            return errorText;
          })(),
          show: password.length < 8 && password !== "",
        }}
      />
      <Textfield
        label="Нууц үг давтах"
        icon="lock"
        placeholder="****"
        secure
        value={passwordRepeat}
        onChangeText={setPasswordRepeat}
        error={{
          text: (() => {
            let errorText = "Алдаа!";
            if (password !== passwordRepeat) {
              errorText = "Нууц үг таарахгүй байна.";
            }
            return errorText;
          })(),
          show: password !== passwordRepeat,
        }}
      />
      <Button
        onPress={changePassword}
        disable={
          (password.length < 8 && password !== "") ||
          password !== passwordRepeat
        }
      >
        баталгаажуулах
      </Button>
    </View>
  );
};

export default ChangePassword;

const css = StyleSheet.create({});
