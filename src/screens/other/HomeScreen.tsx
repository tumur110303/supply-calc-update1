import { FC } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Linking,
  View,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { dark, gray, light, main, w400, w500 } from "../../constants";

type ContentType = {
  title: string;
  navigationName: string;
  icon: any;
  subtitle: string;
};

const { height } = Dimensions.get("window");

const HomeScreen: FC = () => {
  const navigation = useNavigation();

  const contents: ContentType[] = [
    {
      title: "Цахилгаан хэлхээний онол",
      navigationName: "Цахилгаан хэлхээний онол",
      icon: "eye",
      subtitle: "Цахилгаан хэлхээний онолын тооцоолол",
    },
    {
      title: "Цахилгаан хангамжийн тооцоо",
      navigationName: "Тооцоолол",
      icon: "calculator-variant",
      subtitle: "Цахилгаан ачаалал тооцох програм",
    },
    {
      title: "Ерөнхий ойлголт",
      navigationName: "Нийтлэл",
      icon: "newspaper-variant-multiple",
      subtitle: "Цахилгааны талаарх мэдээ мэдээлэл",
    },
    {
      title: "Бяцхан сорил",
      navigationName: "Тест",
      icon: "file-document-edit-outline",
      subtitle: "Тест бөглөж өөрийнхөө мэдлэгийг шалгах",
    },
  ];

  return (
    <ScrollView style={css.container}>
      <FlatList
        data={contents}
        keyExtractor={(item) => item.navigationName}
        contentContainerStyle={{ height: "100%" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.6}
            style={css.item}
            onPress={() => navigation.navigate(item.navigationName as any)}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={20}
              color={light}
              style={css.icon}
            />
            <View style={css.text}>
              <Text style={css.title}>{item.title}</Text>
              <Text style={css.subtitle}>{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          backgroundColor: "#3b5998",
          flexDirection: "row",
          justifyContent: "center",
          padding: 10,
          borderRadius: 5,
        }}
        onPress={async () => {
          const status = await Linking.canOpenURL("fb://page/112382101496580");
          if (status) {
            Linking.openURL("fb://page/112382101496580");
          } else {
            Linking.openURL("https://www.facebook.com/112382101496580");
          }
        }}
      >
        <MaterialCommunityIcons name="facebook" size={20} color={light} />
        <Text
          style={{
            textTransform: "uppercase",
            color: "#fff",
            fontFamily: w500,
            paddingTop: 3,
            paddingLeft: 3,
          }}
        >
          Facebook-ээр холбоо барих
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeScreen;

const css = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 10,
    flex: 1,
  },
  item: {
    height: height / 6,
    backgroundColor: light,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 15,

    flexDirection: "row",
    alignItems: "center",

    borderLeftColor: main,
    borderLeftWidth: 3,
  },
  icon: {
    backgroundColor: main,
    padding: 10,
    borderRadius: 1000,
  },
  text: {
    marginLeft: 10,
  },
  title: {
    fontFamily: w400,
    color: dark,
    fontSize: 16,
    textTransform: "uppercase",
  },
  subtitle: {
    fontFamily: w400,
    color: gray,
  },
});
