import { FC, useContext, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  dark,
  light,
  main,
  w400,
  blue,
  green,
  lightGray,
  red,
} from "../../../constants";
import { useNavigation } from "@react-navigation/native";
import NoSubscription from "../../OtherScreens/NoSubscription";
import SubscriptionContext from "../../../context/SubscriptionContext";
import CountContext from "../../../context/CountContext";

const CalculatorScreen: FC = () => {
  const subscription = useContext(SubscriptionContext);
  const { count } = useContext(CountContext);
  const navigation = useNavigation();

  const contents = [
    [
      {
        title: "Орон сууцны тооцоо",
        navigationName: "Орон сууц",
        icon: "diversify",
        color: blue,
      },
      {
        title: "Олон нийтийн барилга",
        navigationName: "Олон нийтийн барилга",
        icon: "greenhouse",
        color: green,
      },
    ],
    [
      {
        title: "Түгээмэл ашиглагддаг тооцоо",
        navigationName: "Түгээмэл тооцоо",
        icon: "greenhouse",
        color: blue,
      },
      {
        title: "Гэрэлтүүлгийн тооцоо",
        navigationName: "Гэрэлтүүлгийн тооцоо",
        icon: "greenhouse",
        color: green,
      },
    ],
  ];

  return (
    <View style={css.container}>
      {contents.map((el, i) => {
        return (
          <View style={css.items}>
            <View style={css.item}>
              <Text>{el[0].title}</Text>
            </View>
            <View style={css.item}>
              <Text>{el[1].title}</Text>
            </View>
          </View>
        );
      })}
      {(() => {
        if (!subscription && count > 4) {
          return (
            <View style={css.overlayWrapper}>
              <TouchableOpacity
                style={css.overlay}
                activeOpacity={1}
                onPress={() => navigation.goBack()}
              />
              <View style={css.overlayContainer}>
                <NoSubscription />
              </View>
            </View>
          );
        } else null;
      })()}
    </View>
  );
};

export default CalculatorScreen;

const css = StyleSheet.create({
  container: {
    backgroundColor: green,
    height: "100%",
  },
  items: {
    height: "30%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: 5,
  },
  item: { width: "48%", height: "100%", backgroundColor: red },
  overlay: {
    position: "absolute",
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  overlayContainer: {
    backgroundColor: light,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  overlayWrapper: {
    position: "absolute",
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
