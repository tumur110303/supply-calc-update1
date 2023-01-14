import { FC, useContext, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { dark, light, main, w400, blue, green } from "../../../../constants";
import { useNavigation } from "@react-navigation/native";
import NoSubscription from "../../../NoSubscription";
import SubscriptionContext from "../../../../context/SubscriptionContext";
import CountContext from "../../../../context/CountContext";
// Импорт icons

type ContentType = {
  title: string;
  navigationName: string;
  icon: any;
}[];

const ApartmentCalculatorScreen: FC = () => {
  const subscription = useContext(SubscriptionContext);
  const { count } = useContext(CountContext);
  const navigation = useNavigation();
  const contents: ContentType[] = [
    [
      {
        title: "Барилгын оролтын тооцоог хийж гүйцэтгэх",
        navigationName: "Барилгын оролт",
        icon: "home-city-outline",
      },
      {
        title: "Сууцны тоолуурын самбар тэжээх шугамын тооцоо",
        navigationName: "Тоолуурын самбар",
        icon: "home-city-outline",
      },
    ],
    [
      {
        title: "Гэрэлтүүлгийн самбар тэжээх шугамын тооцоо",
        navigationName: "Гэрэлтүүлгийн самбар",
        icon: "home-city-outline",
      },
      {
        title:
          "Сантехникийн тоног төхөөрөмжүүдийн самбар тэжээх шугамын тооцоо",
        navigationName: "Сантехникийн тоног төхөөрөмжүүд",
        icon: "home-city-outline",
      },
    ],
    [
      {
        title: "Дундаж чадлын коэффициент тодорхойлох",
        navigationName: "Дундаж чадлын коэффициент",
        icon: "home-city-outline",
      },
      {
        title: "Нэг асинхрон хөдөлгүүр тэжээх шугамын тооцоо",
        navigationName: "Асинхрон хөдөлгүүр",
        icon: "home-city-outline",
      },
    ],
  ];

  return (
    <View style={css.container}>
      {contents.map((el, i) => {
        return (
          <View key={i}>
            <TouchableOpacity>
              <Text>{el[0].title}</Text>
            </TouchableOpacity>
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

export default ApartmentCalculatorScreen;

const css = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
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
    marginRight: 10,
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
