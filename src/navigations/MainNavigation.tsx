import { createDrawerNavigator } from "@react-navigation/drawer";
import { useContext } from "react";

import useMainHeader from "../hooks/useMainHeader";
import UserContext from "../context/UserContext";

import HomeScreen from "../screens/OtherScreens/HomeScreen";
import LoginScreen from "../screens/OtherScreens/LoginScreen";
import Logout from "../screens/OtherScreens/Logout";
import RegisterScreen from "../screens/OtherScreens/RegisterScreen";
import TheoryCalculatorNavigation from "./TheoryCalculatorNavigation";
import CalculatorNavigation from "./CalculatorNavigation";
import BlogNavigation from "./BlogNavigation";
import TestNavigation from "./TestNavigation";
import VerificationScreen from "../screens/OtherScreens/VerificationScreen";
import PasswordScreen from "../screens/OtherScreens/PasswordScreen";
import ChangePassword from "../screens/OtherScreens/ChangePassword";

export type MainNavigationParams = {
  [name: string]: undefined;
};

const Drawer = createDrawerNavigator<MainNavigationParams>();

const MainNavigation = () => {
  const userContext = useContext(UserContext);
  return (
    <Drawer.Navigator
      screenOptions={(options) => useMainHeader(options)}
      initialRouteName={"Нүүр хуудас"}
    >
      {userContext?.status ? (
        <>
          <>
            <Drawer.Screen name="Нүүр хуудас" component={HomeScreen} />

            <Drawer.Screen
              name="Тооцоолол"
              options={{
                headerShown: false,
              }}
              component={CalculatorNavigation}
            />
            <Drawer.Screen
              name="ЦХО-ын тооцоо"
              options={{
                headerShown: false,
              }}
              component={TheoryCalculatorNavigation}
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
          <Drawer.Screen
            name="Гарах"
            options={{
              headerShown: false,
            }}
            component={Logout}
          />
        </>
      ) : (
        <>
          <Drawer.Screen
            options={{
              headerShown: false,
            }}
            name="Нэвтрэх"
            component={LoginScreen}
          />
          <Drawer.Screen
            options={{
              drawerItemStyle: { height: 0 },
            }}
            name="Баталгаажуулах"
            component={VerificationScreen}
          />
          <Drawer.Screen name="Нууц үг сэргээх" component={PasswordScreen} />
          <Drawer.Screen
            name="Нууц үг солих"
            component={ChangePassword}
            options={{
              drawerItemStyle: { height: 0 },
            }}
          />
          <Drawer.Screen name="Бүртгүүлэх" component={RegisterScreen} />
        </>
      )}
    </Drawer.Navigator>
  );
};

export default MainNavigation;
