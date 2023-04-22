import { FC, useEffect, useState } from "react";
import {
  ScrollView,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { main } from "../../constants";
import { fetchCategories } from "../../prismic";
import { Category } from "../../types/prismic";

const { width } = Dimensions.get("window");

const AllCategoryScreen: FC<{}> = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    setLoading(true);
    const categories: any = await fetchCategories();
    setCategories(categories);
    setLoading(false);
  };

  if (!loading) {
    return (
      <ScrollView contentContainerStyle={css.container}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            activeOpacity={0.7}
            style={css.wrapper}
            onPress={async () => {
              navigation.navigate(
                "Нийтлэлүүд" as never,
                {
                  id: category.id,
                } as never
              );
            }}
          >
            <Text style={css.text}>{category.data.title[0].text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  } else {
    return (
      <ActivityIndicator
        size="large"
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          transform: [{ scale: 1.5 }],
        }}
        color={main}
      />
    );
  }
};

export default AllCategoryScreen;

const css = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  wrapper: {
    marginVertical: 5,
    marginHorizontal: 15,
    borderRadius: 5,
    padding: 20,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
});
