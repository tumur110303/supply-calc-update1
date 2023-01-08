import { createStackNavigator } from "@react-navigation/stack";
import useBlogHeader from "../hooks/useBlogHeader";
import useMainHeader from "../hooks/useMainHeader";

import AllBlogsScreen from "../screens/AllBlogsScreen";
import BlogScreen from "../screens/BlogScreen";

export type StackNavigationParams = {
  [name: string]: undefined;
};

const Stack = createStackNavigator<StackNavigationParams>();

const ContentNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={(options) => useMainHeader(options)}
      initialRouteName="Нийтлэлүүд"
    >
      <Stack.Screen name="Нийтлэлүүд" component={AllBlogsScreen} />
      <Stack.Screen
        name="blog"
        options={(options) => useBlogHeader(options)}
        component={BlogScreen}
      />
    </Stack.Navigator>
  );
};

export default ContentNavigation;
