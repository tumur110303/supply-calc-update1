import { createStackNavigator } from "@react-navigation/stack";
import useMainHeader from "../hooks/useMainHeader";

import ApartmentCalculator from "../screens/calculator/load/Apartment/ApartmentCalculator";
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
      <Stack.Screen name="Орон сууц" component={ApartmentCalculator} />
    </Stack.Navigator>
  );
};

export default TheoryCalculatorNavigation;
