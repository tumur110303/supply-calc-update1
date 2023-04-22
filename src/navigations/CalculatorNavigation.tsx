import { createStackNavigator } from "@react-navigation/stack";
import useMainHeader from "../hooks/useMainHeader";

import CalculatorScreen from "../screens//Supply_Calculator/CalculatorsScreen";
import ApartmentInput from "../screens/Supply_Calculator/ApartmentInput";

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
      <Stack.Screen name="Оролтын тооцоо" component={ApartmentInput} />
    </Stack.Navigator>
  );
};

export default CalculatorNavigation;
