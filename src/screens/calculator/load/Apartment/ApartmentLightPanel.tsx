import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Button from "../../../../components/Button";

const ApartmentLightPanel = () => {
  const [value, setValue] = useState(0);
  const calc = () => {
    console.log("Туршилт indexof function...");
    const arr: number[] = [2, 5, 9, 18, 37, 41, 69, 77, 888, 99, 100];
    const giveValue = arr.indexOf(1);

    setValue(giveValue);
  };
  return (
    <View>
      <Text>{value}</Text>
      <Button onPress={calc}>Тооцоолох</Button>
    </View>
  );
};

export default ApartmentLightPanel;

const styles = StyleSheet.create({});
