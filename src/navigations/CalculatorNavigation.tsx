import { createStackNavigator, Header } from "@react-navigation/stack";
import useMainHeader from "../hooks/useMainHeader";

import CalculatorScreen from "../screens/calculator/load/CalculatorsScreen";
import ApartmentCalculatorNavigation from "./ApartmentCalculatorNavigation";
// import OfficeCalculatorScreen from "../screens/calculator/load/OfficeCalculatorScreen";
// import MotorCalculatorScreen from "../screens/calculator/load/MotorCalculatorScreen";
// import OneEquipmentCalculatorScreen from "../screens/calculator/load/OneEquipmentCalculatorScreen";
// import MagistralVoltageDropScreen from "../screens/calculator/load/MagistralVoltageDropScreen";
// import SmallCalculatorScreen from "../screens/calculator/load/SmallCalculatorScreen";
// import OtherBuildingsScreen from "../screens/calculator/load/OtherBuildingsScreen";
// import HouseCalculatorScreen from "../screens/calculator/load/HouseCalculatorScreen";
// import CoeffMethodScreen from "../screens/calculator/load/CoeffMethodScreen";
// import PrivatePowerScreen from "../screens/calculator/load/PrivatePowerScreen";
// import CospiCalculatorScreen from "../screens/calculator/load/CospiCalculatorScreen";

export type StackNavigationParams = {
  [name: string]: undefined;
};

const Stack = createStackNavigator<StackNavigationParams>();

const CalculatorNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={(options) => useMainHeader(options)}
      initialRouteName="Тооцооны програм"
    >
      <Stack.Screen name="Тооцооны програм" component={CalculatorScreen} />
      <Stack.Screen
        name="Орон сууц"
        options={{ headerShown: false }}
        component={ApartmentCalculatorNavigation}
      />
      {/* <Stack.Screen
        name="Олон нийтийн барилга"
        component={OfficeCalculatorScreen}
      />
      <Stack.Screen name="Нийтийн байр" component={OfficeCalculatorScreen} />
      <Stack.Screen name="Ойролцоо тооцоо" component={SmallCalculatorScreen} />
      <Stack.Screen
        name="Барилгуудын тооцоо"
        component={OtherBuildingsScreen}
      />
      <Stack.Screen
        name="Тансаг зэрэглэлийн сууц"
        component={HouseCalculatorScreen}
      />
      <Stack.Screen
        name="Асинхрон хөдөлгүүр"
        component={MotorCalculatorScreen}
      />
      <Stack.Screen
        name="Тоног төхөөрөмж"
        component={OneEquipmentCalculatorScreen}
      />
      <Stack.Screen
        name="Магистрал шугам"
        component={MagistralVoltageDropScreen}
      />
      <Stack.Screen
        name="Дундаж чадлын коэффициент"
        component={CospiCalculatorScreen}
      />
      <Stack.Screen
        name="Ашиглалтын коэффициентийн арга"
        component={CoeffMethodScreen}
      />
      <Stack.Screen name="Хувийн чадлын арга" component={PrivatePowerScreen} /> */}
    </Stack.Navigator>
  );
};

export default CalculatorNavigation;
