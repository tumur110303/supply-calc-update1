import { createDrawerNavigator } from "@react-navigation/drawer";
import { useContext } from "react";

import useMainHeader from "../hooks/useMainHeader";

import HomeScreen from "../screens/other/HomeScreen";
import CalculatorNavigation from "./CalculatorNavigation";
import BlogNavigation from "./BlogNavigation";
import TestNavigation from "./TestNavigation";
import TheoryCalculatorNavigation from "./TheoryCalculatorNavigation";

export type MainNavigationParams = {
  [name: string]: undefined;
};

const Drawer = createDrawerNavigator<MainNavigationParams>();

const MainNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={(options) => useMainHeader(options)}
      initialRouteName={"Нүүр хуудас"}
    >
      <>
        <>
          <Drawer.Screen name="Нүүр хуудас" component={HomeScreen} />

          <Drawer.Screen
            name="Цахилгаан хэлхээний онол"
            options={{
              headerShown: false,
            }}
            component={TheoryCalculatorNavigation}
          />
          <Drawer.Screen
            name="Тооцоолол"
            options={{
              headerShown: false,
            }}
            component={CalculatorNavigation}
          />
          <Drawer.Screen
            name="Нийтлэл"
            options={{
              headerShown: false,
            }}
            component={BlogNavigation}
          />
          <Drawer.Screen
            name="Тест"
            options={{
              headerShown: false,
            }}
            component={TestNavigation}
          />
        </>
      </>
    </Drawer.Navigator>
  );
};

export default MainNavigation;
