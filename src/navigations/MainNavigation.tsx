import { createDrawerNavigator } from "@react-navigation/drawer";
import { useContext } from "react";

import useMainHeader from "../hooks/useMainHeader";
import UserContext from "../context/UserContext";

import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import Logout from "../screens/Logout";
import RegisterScreen from "../screens/RegisterScreen";
import CalculatorNavigation from "./CalculatorNavigation";
import BlogNavigation from "./BlogNavigation";
import NoSubscription from "../screens/NoSubscription";
import TestNavigation from "./TestNavigation";
import VerificationScreen from "../screens/VerificationScreen";
import PasswordScreen from "../screens/PasswordScreen";
import ChangePassword from "../screens/ChangePassword";

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
