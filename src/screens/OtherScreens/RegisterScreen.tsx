import { useNavigation } from "@react-navigation/native";
import { FC, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../axios";
import Button from "../../components/Button";
import Textfield from "../../components/Textfield";
import { main } from "../../constants";

type Information = {
  email: string;
  password: string;
  passwordRetype: string;
};

const RegisterScreen: FC = () => {
  const [information, setInformation] = useState<Information>({
    email: "",
    password: "",
    passwordRetype: "",
  });
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const valueChanger = (value: string, section: keyof Information) =>
    setInformation((state) => {
      const copy = { ...state };
      copy[section] = value;
      return copy;
    });

  const register = () => {
    (async () => {
      try {
        const device_id = await AsyncStorage.getItem("device-id");
        const { email, password } = information;
        if (!Object.values(information).find((el) => el === "")) {
          setLoading(true);
          const user = (
            await axios.post("/register", {
              email,
              password,
              device_id,
            })
          ).data;

          await axios.post("/user/verification", { id: user.data._id });
          navigation.navigate(
            "Баталгаажуулах" as never,
            {
              id: user.data._id,
              from: "verification",
            } as never
          );
          setLoading(false);
        } else {
          Alert.alert("Мэдээллээ бүрэн бөглөнө үү");
        }
      } catch (error: any) {
        console.log(error);
        if (error.response) {
          Alert.alert(error.response.data.message);
        } else {
          Alert.alert(error.message);
        }
      }
    })();
  };
  return (
    <>
      <ScrollView style={css.container}>
        <Textfield
          label="И-Мэйл хаяг"
          icon="email"
          placeholder="Мэдээлэл хүлээн авах цахим хаяг"
          keyboardType={"email-address"}
          onChangeText={(value) => valueChanger(value.toLowerCase(), "email")}
        />
        <Textfield
          label="Нууц үг"
          icon="lock"
          placeholder="Нэвтрэхэд ашиглах нууц үг"
          secure
          onChangeText={(value) => valueChanger(value, "password")}
          error={{
            text: (() => {
              let errorText = "Алдаа!!!";
              if (information.password.length < 8) {
                errorText = "Нууц үг хэтэрхий богинохон байна.";
              }
              return errorText;
            })(),
            show:
              information.password.length < 8 && information.password !== "",
          }}
        />
        <Textfield
          label="Нууц үг давтах"
          secure
          placeholder="Нууц үгээ баталгаажуулж дахин оруулна уу?"
          icon="lock"
          onChangeText={(value) => valueChanger(value, "passwordRetype")}
          error={{
            text: (() => {
              let errorText = "Алдаа!!!";
              if (information.password !== information.passwordRetype) {
                errorText = "Нууц үг таарахгүй байна.";
              }
              return errorText;
            })(),
            show: information.password !== information.passwordRetype,
          }}
        />

        <Button onPress={register} style={{ marginTop: 20 }}>
          Бүртгүүлэх
        </Button>
      </ScrollView>
      {loading && (
        <View style={css.indicatorContainer}>
          <ActivityIndicator style={css.indicator} size="large" color={main} />
        </View>
      )}
    </>
  );
};

export default RegisterScreen;

const css = StyleSheet.create({
  container: {
    marginVertical: 15,
    marginHorizontal: 10,
  },

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
