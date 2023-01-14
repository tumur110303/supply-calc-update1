import { createStackNavigator } from "@react-navigation/stack";
import useMainHeader from "../hooks/useMainHeader";

import ApartmentCalculator from "../screens/calculator/load/Apartment/ApartmentCalculator";
import ApartmentHousehold from "../screens/calculator/load/Apartment/ApartmentHousehold";
import ApartmentInput from "../screens/calculator/load/Apartment/ApartmentInput";
import ApartmentLightPanel from "../screens/calculator/load/Apartment/ApartmentLightPanel";
import CospiCalculatorScreen from "../screens/calculator/load/CospiCalculatorScreen";
import MotorCalculatorScreen from "../screens/calculator/load/MotorCalculatorScreen";
import PlumbCalculatorScreen from "../screens/calculator/load/PlumbCalculatorScreen";

export type StackNavigationParams = {
  [name: string]: undefined;
};

const Stack = createStackNavigator<StackNavigationParams>();

const ApartmentCalculatorNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={(options) => useMainHeader(options)}
      initialRouteName="Орон сууцны барилга"
    >
      <Stack.Screen
        name="Орон сууцны барилга"
        component={ApartmentCalculator}
      />
      <Stack.Screen name="Барилгын оролт" component={ApartmentInput} />
      <Stack.Screen name="Тоолуурын самбар" component={ApartmentHousehold} />
      <Stack.Screen
        name="Гэрэлтүүлгийн самбар"
        component={ApartmentLightPanel}
      />
      <Stack.Screen
        name="Сантехникийн тоног төхөөрөмжүүд"
        component={PlumbCalculatorScreen}
      />
      <Stack.Screen
        name="Дундаж чадлын коэффициент"
        component={CospiCalculatorScreen}
      />
      <Stack.Screen
        name="Асинхрон хөдөлгүүр"
        component={MotorCalculatorScreen}
      />
      <Stack.Screen name="Тоног төхөөрөмж" component={MotorCalculatorScreen} />
    </Stack.Navigator>
  );
};

export default ApartmentCalculatorNavigation;
