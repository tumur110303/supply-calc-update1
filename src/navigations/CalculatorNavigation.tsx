import { createStackNavigator } from "@react-navigation/stack";
import useMainHeader from "../hooks/useMainHeader";

import CalculatorScreen from "../screens/Supply_Calculator/SupplyHomeScreens/CalculatorsScreen";
import ApartmentCalculatorScreen from "../screens/Supply_Calculator/SupplyHomeScreens/ApartmentCalculatorScreen";
import CivilCalculatorScreen from "../screens/Supply_Calculator/SupplyHomeScreens/CivilCalculatorScreen";
import OtherCalculatorScreen from "../screens/Supply_Calculator/SupplyHomeScreens/OtherCalculatorScreen";
import LightingCalculatorScreen from "../screens/Supply_Calculator/SupplyHomeScreens/LightingCalculatorScreen";

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
      <Stack.Screen name="Орон сууц" component={ApartmentCalculatorScreen} />
      <Stack.Screen
        name="Олон нийтийн барилга"
        component={CivilCalculatorScreen}
      />
      <Stack.Screen name="Түгээмэл тооцоо" component={OtherCalculatorScreen} />
      <Stack.Screen
        name="Гэрэлтүүлгийн тооцоо"
        component={LightingCalculatorScreen}
      />
    </Stack.Navigator>
  );
};

export default CalculatorNavigation;
