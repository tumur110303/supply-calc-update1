import { FC, useContext } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { dark, light, main, w400, blue, green } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import NoSubscription from "../OtherScreens/NoSubscription";
import SubscriptionContext from "../../context/SubscriptionContext";
import CountContext from "../../context/CountContext";

type ContentType = {
  title: string;
  navigationName: string;
  icon: any;
  color: string;
};

const CalculatorScreen: FC = () => {
  const subscription = useContext(SubscriptionContext);
  const { count } = useContext(CountContext);
  const navigation = useNavigation();
  const contents: ContentType[] = [
    {
      title: "Бүлэг 1",
      navigationName: "Тест-1",
      icon: "head-question-outline",
      color: blue,
    },
    {
      title: "Бүлэг 2",
      navigationName: "Тест-2",
      icon: "head-question-outline",
      color: green,
    },
    {
      title: "Бүлэг 3",
      navigationName: "Тест-3",
      icon: "head-question-outline",
      color: blue,
    },
    {
      title: "Бүлэг 4",
      navigationName: "Тест-4",
      icon: "head-question-outline",
      color: green,
    },
    {
      title: "Бүлэг 5",
      navigationName: "Тест-5",
      icon: "head-question-outline",
      color: blue,
    },
    {
      title: "Бүлэг 6",
      navigationName: "Тест-6",
      icon: "head-question-outline",
      color: green,
    },
    {
      title: "Бүлэг 7",
      navigationName: "Тест-7",
      icon: "head-question-outline",
      color: blue,
    },
    {
      title: "Бүлэг 8",
      navigationName: "Тест-8",
      icon: "head-question-outline",
      color: green,
    },
    {
      title: "Бүлэг 9",
      navigationName: "Тест-9",
      icon: "head-question-outline",
      color: blue,
    },
    {
      title: "Бүлэг 10",
      navigationName: "Тест-10",
      icon: "head-question-outline",
      color: green,
    },
    {
      title: "Бүлэг 11",
      navigationName: "Тест-11",
      icon: "head-question-outline",
      color: blue,
    },
    {
      title: "Бүлэг 12",
      navigationName: "Тест-12",
      icon: "head-question-outline",
      color: green,
    },
    {
      title: "Бүлэг 13",
      navigationName: "Тест-13",
      icon: "head-question-outline",
      color: blue,
    },
    {
      title: "Бүлэг 14",
      navigationName: "Тест-14",
      icon: "head-question-outline",
      color: green,
    },
    {
      title: "Бүлэг 15",
      navigationName: "Тест-15",
      icon: "head-question-outline",
      color: blue,
    },
  ];

  return (
    <View style={css.container}>
      <FlatList
        keyExtractor={(item) => item.navigationName}
        data={contents}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.6}
            style={css.item}
            onPress={() => navigation.navigate(item.navigationName as never)}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={26}
              color={item.color}
            />
            <Text style={css.title}>{item.title}</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={26}
              color={main}
              style={css.chevron}
            />
          </TouchableOpacity>
        )}
      />
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
  },
  line: {
    height: "100%",
    width: 2,
    backgroundColor: main,
    marginRight: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    backgroundColor: light,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginVertical: 10,

    borderRadius: 5,
  },
  title: {
    fontFamily: w400,
    textTransform: "uppercase",
    marginLeft: 10,
    color: dark,
  },
  chevron: {
    position: "absolute",
    right: 10,
  },
  overlay: {
    position: "absolute",
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  overlayContainer: {
    backgroundColor: light,
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 10,
    marginHorizontal: 5,
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
