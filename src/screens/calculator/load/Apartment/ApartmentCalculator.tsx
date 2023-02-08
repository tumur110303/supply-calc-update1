import { FC, useContext, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { dark, light, main, w400, blue, green } from "../../../../constants";
import { useNavigation } from "@react-navigation/native";
import NoSubscription from "../../../NoSubscription";
import SubscriptionContext from "../../../../context/SubscriptionContext";
import CountContext from "../../../../context/CountContext";
// Импорт icons
import Icon1 from "../../../../../assets/apartment-icons/01.png";
import Icon2 from "../../../../../assets/apartment-icons/02.png";
import Icon3 from "../../../../../assets/apartment-icons/03.png";
import Icon46 from "../../../../../assets/apartment-icons/0406.png";
import Icon5 from "../../../../../assets/apartment-icons/05.png";
import Icon7 from "../../../../../assets/apartment-icons/07.png";

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
        icon: Icon1,
      },
      {
        title: "Сууцны тоолуурын самбар тэжээх шугамын тооцоо",
        navigationName: "Тоолуурын самбар",
        icon: Icon2,
      },
    ],
    [
      {
        title: "Гэрэлтүүлгийн самбар тэжээх шугамын тооцоо",
        navigationName: "Гэрэлтүүлгийн самбар",
        icon: Icon3,
      },
      {
        title:
          "Сантехникийн тоног төхөөрөмжүүдийн самбар тэжээх шугамын тооцоо",
        navigationName: "Сантехникийн тоног төхөөрөмжүүд",
        icon: Icon46,
      },
    ],
    [
      {
        title: "Дундаж чадлын коэффициент тодорхойлох",
        navigationName: "Дундаж чадлын коэффициент",
        icon: Icon5,
      },
      {
        title: "Нэг асинхрон хөдөлгүүр тэжээх шугамын тооцоо",
        navigationName: "Асинхрон хөдөлгүүр",
        icon: Icon46,
      },
    ],
    [
      {
        title: "Лифт тэжээх шугамын тооцоо",
        navigationName: "Лифт",
        icon: Icon7,
      },
      {
        title: "Магистраль шугамын хүчдэлийн алдагдал",
        navigationName: "Хүчдэлийн алдагдал",
        icon: Icon1,
      },
    ],
  ];

  return (
    <ScrollView style={css.container}>
      {contents.map((el, i) => {
        return (
          <View key={i} style={css.components}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.navigate(el[0].navigationName as any)}
              style={css.touchable}
            >
              <Image style={{ width: 60, height: 60 }} source={el[0].icon} />
              <Text style={{ textAlign: "center" }}>{el[0].title}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.navigate(el[1].navigationName as any)}
              style={css.touchable}
            >
              <Image style={{ width: 60, height: 60 }} source={el[1].icon} />
              <Text style={{ textAlign: "center" }}>{el[1].title}</Text>
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
    </ScrollView>
  );
};

export default ApartmentCalculatorScreen;

const css = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  components: {
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  touchable: {
    margin: 5,
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: blue,
    borderRadius: 20,
    height: 150,
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
