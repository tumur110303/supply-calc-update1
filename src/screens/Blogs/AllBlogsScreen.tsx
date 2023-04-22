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
import moment from "moment";
import "moment/locale/mn";
import { Blog } from "../../types/prismic";
import { dark, gray, light, main, w400, w500 } from "../../constants";
import { RouteProp, useNavigation } from "@react-navigation/native";
import NoSubscription from "../OtherScreens/NoSubscription";
import SubscriptionContext from "../../context/SubscriptionContext";
import CountContext from "../../context/CountContext";
import {
  fetchBlogs,
  fetchBlogsByCategory,
  search as searchBlog,
} from "../../prismic";

const { width } = Dimensions.get("window");

type Props = {
  route: RouteProp<any>;
};

const AllBlogsScreen: FC<Props> = ({ route }) => {
  const subscription = useContext(SubscriptionContext);
  const { count, increase } = useContext(CountContext);
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();
  const params: any = route.params;
  const id = params.id;

  useEffect(() => {
    (async () => {
      const result: any = await fetchBlogsByCategory(id, 100);
      setBlogs(result);
    })();
  }, []);

  const fetch = async () => {
    try {
      setLoading(true);
      const blogs: any = await fetchBlogs();
      setBlogs(blogs);
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
        ) : null}
        {!loading ? (
          <>
            <ScrollView
              style={css.container}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={refresh} />
              }
            >
              {blogs.map((blog) => {
                const time = moment(blog.last_publication_date).fromNow();

                if (blog.data) {
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
                        await increase();
                      }}
                    >
                      {blog.data.thumbnail ? (
                        <Image
                          style={css.image}
                          source={{ uri: blog.data.thumbnail.url }}
                        />
                      ) : null}

                      <View style={css.textContainer}>
                        {blog.data.garchig ? (
                          <Text style={css.header}>
                            {blog.data.garchig[0].text}
                          </Text>
                        ) : null}
                        <Text style={css.date}>{time}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                } else null;
              })}
            </ScrollView>
          </>
        ) : null}

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
  search: {
    marginHorizontal: 15,
    marginTop: 20,
  },
  categoryContainer: {
    marginTop: 20,
    marginLeft: 15,
    height: 40,
    maxHeight: 40,
  },
  category: {
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 5,
    height: 30,
    maxHeight: 30,
    backgroundColor: "#ddd",
    marginRight: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  categoryActive: {
    backgroundColor: main,
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 5,
    height: 30,
    maxHeight: 30,
    marginRight: 10,
    borderRadius: 5,
    marginBottom: 15,
    flexDirection: "row",
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
