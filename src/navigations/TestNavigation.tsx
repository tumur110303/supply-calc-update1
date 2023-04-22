import { createStackNavigator } from "@react-navigation/stack";
import useMainHeader from "../hooks/useMainHeader";

import TestScreen from "../screens/Tests/TestScreen";
import TestScreen1 from "../screens/Tests/TestScreen1";
import TestScreen10 from "../screens/Tests/TestScreen10";
import TestScreen11 from "../screens/Tests/TestScreen11";
import TestScreen12 from "../screens/Tests/TestScreen12";
import TestScreen13 from "../screens/Tests/TestScreen13";
import TestScreen14 from "../screens/Tests/TestScreen14";
import TestScreen15 from "../screens/Tests/TestScreen15";
import TestScreen2 from "../screens/Tests/TestScreen2";
import TestScreen3 from "../screens/Tests/TestScreen3";
import TestScreen4 from "../screens/Tests/TestScreen4";
import TestScreen5 from "../screens/Tests/TestScreen5";
import TestScreen6 from "../screens/Tests/TestScreen6";
import TestScreen7 from "../screens/Tests/TestScreen7";
import TestScreen8 from "../screens/Tests/TestScreen8";
import TestScreen9 from "../screens/Tests/TestScreen9";

export type StackNavigationParams = {
  [name: string]: undefined;
};

const Stack = createStackNavigator<StackNavigationParams>();

const TestNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={(options) => useMainHeader(options)}
      initialRouteName="Тестүүд"
    >
      <Stack.Screen name="Тестүүд" component={TestScreen} />
      <Stack.Screen name="Тест-1" component={TestScreen1} />
      <Stack.Screen name="Тест-2" component={TestScreen2} />
      <Stack.Screen name="Тест-3" component={TestScreen3} />
      <Stack.Screen name="Тест-4" component={TestScreen4} />
      <Stack.Screen name="Тест-5" component={TestScreen5} />
      <Stack.Screen name="Тест-6" component={TestScreen6} />
      <Stack.Screen name="Тест-7" component={TestScreen7} />
      <Stack.Screen name="Тест-8" component={TestScreen8} />
      <Stack.Screen name="Тест-9" component={TestScreen9} />
      <Stack.Screen name="Тест-10" component={TestScreen10} />
      <Stack.Screen name="Тест-11" component={TestScreen11} />
      <Stack.Screen name="Тест-12" component={TestScreen12} />
      <Stack.Screen name="Тест-13" component={TestScreen13} />
      <Stack.Screen name="Тест-14" component={TestScreen14} />
      <Stack.Screen name="Тест-15" component={TestScreen15} />
    </Stack.Navigator>
  );
};

export default TestNavigation;
