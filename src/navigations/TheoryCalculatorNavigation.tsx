import { createStackNavigator } from "@react-navigation/stack";
import useMainHeader from "../hooks/useMainHeader";

import TheoryCalculator from "../screens/calculator/theory/TheoryCalculator";

export type StackNavigationParams = {
  [name: string]: undefined;
};

const Stack = createStackNavigator<StackNavigationParams>();

const TheoryCalculatorNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={(options) => useMainHeader(options)}
      initialRouteName="Цахилгаан хэлхээний онол"
    >
      <Stack.Screen
        name="Цахилгаан хэлхээний онол"
        component={TheoryCalculator}
      />
    </Stack.Navigator>
  );
};

export default TheoryCalculatorNavigation;
