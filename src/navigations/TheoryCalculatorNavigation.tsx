import { createStackNavigator } from "@react-navigation/stack";
import useMainHeader from "../hooks/useMainHeader";

import TheoryCalculatorScreen from "../screens/Theory_Calculator/TheoryCalculatorScreen";
import ResistorCalculator from "../screens/Theory_Calculator/ResistorCalculator";

export type StackNavigationParams = {
  [name: string]: undefined;
};

const Stack = createStackNavigator<StackNavigationParams>();

const TheoryCalculatorNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={(options) => useMainHeader(options)}
      initialRouteName="ЦХО-ын тооцоо"
    >
      <Stack.Screen name="ЦХО-ын тооцоо" component={TheoryCalculatorScreen} />
      <Stack.Screen name="Резисторын тооцоо" component={ResistorCalculator} />
    </Stack.Navigator>
  );
};

export default TheoryCalculatorNavigation;
