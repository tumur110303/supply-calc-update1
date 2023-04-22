import { FC, useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";
import moment from "moment";
import "moment/locale/mn";
import { Response } from "../../types/prismic";
import { dark, gray, light, main, w400, w500 } from "../../constants";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const AllBlogsScreen: FC = () => {
  const [blogs, setBlogs] = useState<Response | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      setLoading(true);
      const ref = (
        await axios.get("https://tsahilgaan-hangamj.cdn.prismic.io/api/v2")
      ).data.refs[0].ref;
      const result = (
        await axios.get(
          `https://tsahilgaan-hangamj.cdn.prismic.io/api/v2/documents/search?ref=${ref}&fetch=content.garchig content.thumbnail&q=[[at(document.type,"content")]]`
        )
      ).data;
      setBlogs(result);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await fetch();
    setRefreshing(false);
  };

  if (blogs) {
    return (
      <View style={css.wrapper}>
        {loading ? (
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
        ) : (
          <ScrollView
            style={css.container}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} />
            }
          >
            {blogs.results.map((blog) => {
              const time = moment(blog.last_publication_date).fromNow();

              return (
                <TouchableOpacity
                  key={blog.uid}
                  activeOpacity={0.7}
                  style={css.item}
                  onPress={async () => {
                    navigation.navigate(
                      "blog" as never,
                      {
                        id: blog.id,
                      } as never
                    );
                  }}
                >
                  <Image
                    style={css.image}
                    source={{ uri: blog.data.thumbnail.url }}
                  />
                  <View style={css.textContainer}>
                    <Text style={css.header}>{blog.data.garchig[0].text}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    );
  } else {
    return <View></View>;
  }
};

export default AllBlogsScreen;

const css = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
  },
  container: {
    marginHorizontal: 15,
    marginVertical: 20,
  },
  item: {
    flexDirection: "row",
    marginBottom: 10,
  },
  image: {
    width: width / 4,
    height: width / 4,
  },
  textContainer: {
    width: (width / 4) * 3 - 30,
    height: width / 4,
    justifyContent: "center",
    paddingLeft: 10,
  },
  header: {
    textTransform: "uppercase",
    fontFamily: w500,
    color: dark,
    fontSize: 16,
  },
  date: {
    fontFamily: w400,
    textTransform: "uppercase",
    color: gray,
    marginTop: 5,
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
