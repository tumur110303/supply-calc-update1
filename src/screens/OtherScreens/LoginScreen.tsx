import { FC, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import axios from "../../axios";

import { dark, darker, light, main, w400, w500 } from "../../constants";
import logo from "../../../assets/logo-white.png";
import Textfield from "../../components/Textfield";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import UserContext from "../../context/UserContext";
import SocketContext from "../../context/SocketContext";
import SetSubscription from "../../context/SetSubscription";
import SetCount from "../../context/SetCount";

const LoginScreen: FC = () => {
  const userContext = useContext(UserContext);
  const socket = useContext(SocketContext);
  const setSubscription = useContext(SetSubscription);
  const setCount = useContext(SetCount);
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");

  const [isDevice, setIsDevice] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [deviceInfo, setDeviceInfo] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const login = () => {
    (async () => {
      try {
        const deviceId = await AsyncStorage.getItem("device-id");
        setLoading(true);
        const result = (
          await axios.post(
            "/login",
            { email: email.toLowerCase(), password },
            {
              headers: {
                "device-id": deviceId ? deviceId : "",
              },
            }
          )
        ).data;
        setId(result.id);

        if (result.verfied) {
          if (result.device) {
            userContext?.setStatus(true);
            setLoading(false);
            navigation.navigate("Нүүр хуудас" as never);
          } else {
            setIsDevice(result.device);
          }
          if (setSubscription) {
            setSubscription(result.subscription);
          }
          if (setCount) {
            setCount(result.count);
          }
        } else {
          setLoading(true);
          await axios.post("/user/verification", { id: result.id });
          setLoading(false);
          navigation.navigate(
            "Баталгаажуулах" as never,
            {
              id: result.id,
              from: "verification",
            } as never
          );
        }
      } catch (error: any) {
        console.log(error.response);
        setLoading(false);
        if (error.response) {
          Alert.alert(error.response.data.message);
        } else {
          Alert.alert(error.message);
        }
      }
    })();
  };

  useEffect(() => {
    if (isDevice === false) {
      (async () => {
        try {
          const result = (await axios.get("/user/device")).data;

          setDeviceInfo(result.result);
          setShowModal(true);
        } catch (error: any) {
          if (error.response) {
            Alert.alert(error.response.data.message);
          } else {
            Alert.alert(error.message);
          }
        }
      })();
    }
  }, [isDevice]);

  const changeDevice = () => {
    const info = `${Device.manufacturer?.toUpperCase()}-${Device.modelName} ${
      Device.deviceName
    }`;

    (async () => {
      try {
        const deviceId = await AsyncStorage.getItem("device-id");
        await axios.post(
          "/user/device",
          { deviceInfo: info },
          {
            headers: {
              "device-id": deviceId ? deviceId : "",
            },
          }
        );

        socket?.emit(`changed-device`, id);

        setShowModal(false);
        userContext?.setStatus(true);
        navigation.navigate("Нүүр хуудас" as never);
      } catch (error: any) {
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
      <SafeAreaView style={css.container}>
        <LinearGradient colors={[dark, darker]} style={css.background} />
        <Modal
          visible={showModal}
          setVisible={setShowModal}
          title="Бүртгэлгүй төхөөрөмж"
        >
          <Text style={css.modalLabel}>Төхөөрөмжийн нэр:</Text>
          <Text style={css.modalText}>{deviceInfo}</Text>

          <Button style={{ marginTop: 15 }} onPress={changeDevice}>
            Төхөөрөмжнөөс гарах
          </Button>
          <Button>Буцах</Button>
        </Modal>

        <View style={css.welcomeContainer}>
          <Image source={logo} style={css.logo} />
          <Text style={css.welcome}>Тавтай морил</Text>
        </View>

        <View style={css.loginContainer}>
          <Textfield
            placeholder="Имэйл оруулна уу?"
            icon="account-arrow-right-outline"
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Textfield
            style={{ marginTop: 10 }}
            placeholder="••••••••"
            icon="lock-open-outline"
            onChangeText={setPassword}
            secure
          />
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.navigate("Нууц үг сэргээх" as never)}
          >
            <Text
              style={{
                color: "#fff",
                textTransform: "uppercase",
                fontSize: 13,
                textAlign: "right",
                marginTop: 10,
              }}
            >
              Нууц үг сэргээх{" "}
            </Text>
          </TouchableOpacity>
          <Button style={{ marginTop: 15 }} onPress={login}>
            Нэвтрэх
          </Button>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.navigate("Бүртгүүлэх" as never)}
          >
            <Text style={css.registerText}>Бүртгүүлэх</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {loading && (
        <View style={css.indicatorContainer}>
          <ActivityIndicator style={css.indicator} size="large" color={main} />
        </View>
      )}
    </>
  );
};

export default LoginScreen;

const css = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  logo: {
    width: 80,
    height: 80,
  },
  welcomeContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  welcome: {
    fontFamily: w500,
    fontSize: 25,
    textTransform: "uppercase",
    color: light,
    marginTop: 10,
  },

  loginContainer: {
    flex: 1,
    width: "70%",
    paddingHorizontal: 15,
  },
  loginText: {
    color: main,
    fontSize: 20,
    fontFamily: w400,
    textTransform: "uppercase",
    marginLeft: 5,
  },
  registerText: {
    color: light,
    textAlign: "center",
    fontFamily: w400,
    textTransform: "uppercase",
    marginTop: 20,
  },

  modalLabel: {
    color: dark,
    fontFamily: w500,
    fontSize: 16,
    textTransform: "uppercase",
    marginTop: 10,
  },
  modalText: {
    color: dark,
    fontFamily: w400,
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
