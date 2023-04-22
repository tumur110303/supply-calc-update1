import { FC, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import axios from "axios";
import { Blog } from "../../types/prismic";
import { RichText } from "react-native-prismic-richtext";
import { dark, main, w400, w500 } from "../../constants";

const { width } = Dimensions.get("window");

type Props = {
  route: RouteProp<any>;
};

const BlogScreen: FC<Props> = ({ route }) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const params: any = route.params;
  const id = params.id;

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    setLoading(true);
    const ref = (
      await axios.get("https://tsahilgaan-hangamj.cdn.prismic.io/api/v2")
    ).data.refs[0].ref;
    const result = (
      await axios.get(
        `https://tsahilgaan-hangamj.cdn.prismic.io/api/v2/documents/search?ref=${ref}&q=[[at(document.id,"${id}")]]`
      )
    ).data;

    setBlog(result.results[0]);
    setLoading(false);
  };

  if (!loading && blog) {
    return (
      <ScrollView style={css.container}>
        <Text style={css.title}>{blog.data.garchig[0].text}</Text>
        <Image
          source={{ uri: blog.data.thumbnail.url }}
          style={{
            width: width - 20,
            height:
              ((width - 20) * blog.data.thumbnail.dimensions.height) /
              blog.data.thumbnail.dimensions.width,
          }}
        />
        <RichText
          richText={blog.data["undsen-text"]}
          defaultStyle={{
            paddingVertical: 5,
            color: dark,
            fontSize: 16,
            fontFamily: w400,
          }}
          styles={{
            hyperlink: {
              textDecorationLine: "underline",
              color: main,
            },
            hyperlinkHover: {
              textDecorationLine: undefined,
            },
            strong: {
              fontFamily: w500,
            },
            em: {
              fontStyle: "italic",
            },
            image: {
              width: width - 20,
            },
            imageWrapper: {
              paddingVertical: 5,
            },
          }}
        />
        <View style={css.margin}></View>
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

export default BlogScreen;

const css = StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: w500,
    textTransform: "uppercase",
    color: dark,
    marginBottom: 20,
  },
  margin: {
    marginBottom: 30,
  },
});
