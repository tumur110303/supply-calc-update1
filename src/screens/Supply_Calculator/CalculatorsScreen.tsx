import { FC, useContext, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { dark, light, main, w400, blue, green, w500 } from "../../constants";
import { useNavigation } from "@react-navigation/native";

type ContentType = {
  title: string;
  navigationName: string;
  icon: any;
  color: string;
};

const CalculatorScreen: FC = () => {
  const navigation = useNavigation();
  const contents: ContentType[] = [
    {
      title: "Оролтын тооцоо",
      navigationName: "Оролтын тооцоо",
      icon: "diversify",
      color: blue,
    },
  ];

  return (
    <View style={css.container}>
      <Text style={css.bigTitle}>Орон сууцны барилгын тооцоо</Text>
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
            <Text
              style={{
                flexDirection: "row",
                width: "90%",
                flexWrap: "wrap",
              }}
            >
              <Text style={css.title}>{item.title}</Text>
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={26}
              color={main}
              style={css.chevron}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CalculatorScreen;

const css = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  bigTitle: {
    marginVertical: 10,
    alignSelf: "center",
    color: dark,
    textTransform: "uppercase",
    fontFamily: w500,
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: blue,
    borderBottomWidth: 1,
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
