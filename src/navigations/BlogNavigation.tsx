import { createStackNavigator } from "@react-navigation/stack";
import useBlogHeader from "../hooks/useBlogHeader";
import useMainHeader from "../hooks/useMainHeader";

import AllBlogsScreen from "../screens/Blogs/AllBlogsScreen";
import AllCategoryScreen from "../screens/Blogs/AllCategoryScreen";
import BlogScreen from "../screens/Blogs/BlogScreen";

export type StackNavigationParams = {
  [name: string]: undefined;
};

const Stack = createStackNavigator<StackNavigationParams>();

const ContentNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={(options) => useMainHeader(options)}
      initialRouteName="Категориуд"
    >
      <Stack.Screen name="Категориуд" component={AllCategoryScreen as any} />
      <Stack.Screen name="Нийтлэлүүд" component={AllBlogsScreen as any} />
      <Stack.Screen
        name="blog"
        options={(options) => useBlogHeader(options)}
        component={BlogScreen as any}
      />
    </Stack.Navigator>
  );
};

export default ContentNavigation;
