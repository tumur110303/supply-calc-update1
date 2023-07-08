import { createStackNavigator } from "@react-navigation/stack";
import useMainHeader from "../hooks/useMainHeader";

import CalculatorScreen from "../screens/Supply_Calculator/SupplyHomeScreens/CalculatorsScreen";
import ApartmentInput from "../screens/Supply_Calculator/Apartment/ApartmentInput";
import ApartmentMeterRadial from "../screens/Supply_Calculator/Apartment/ApartmentMeterRadial";
import ApartmentMeterMagistral from "../screens/Supply_Calculator/Apartment/ApartmentMeterMagistral";

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
      <Stack.Screen
        name="ДНС тэжээх радиал шугам"
        component={ApartmentMeterRadial}
      />
      <Stack.Screen
        name="ДНС тэжээх магистрал шугам"
        component={ApartmentMeterMagistral}
      />
    </Stack.Navigator>
  );
};

export default CalculatorNavigation;
