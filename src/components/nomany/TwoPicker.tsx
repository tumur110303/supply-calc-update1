import { FC } from "react";
import { View, StyleSheet, Text, StyleProp, ViewStyle } from "react-native";

import { dark, gray, light, main, w400 } from "../../constants";
import FormPicker from "../FormPicker";

type Props = {
  label?: string;
  placeholder?: string | [string, string, string];
  value: string | [string, string];
  onChangeValue?: (value: string) => void;
  checkChangeValue?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  branches: { label: string; value: string }[];
  voltageBranchNumbers: { label: string; value: string }[];
};

const TwoPicker: FC<Props> = ({
  label,
  value,
  onChangeValue,
  checkChangeValue,
  voltageBranchNumbers,
  branches,
  style,
}) => {
  return (
    <View style={[css.container, style]}>
      {label && <Text style={css.title}>{label}</Text>}
      <View style={css.wrapper}>
        <FormPicker
          label="Салааны тоо"
          options={branches}
          onValueChange={onChangeValue}
          value={typeof value === "object" ? value[0] : value}
          style={{ marginLeft: 5 }}
        />
        <FormPicker
          label="Фазын хүчдэлтэй"
          options={voltageBranchNumbers}
          onValueChange={checkChangeValue}
          value={typeof value === "object" ? value[1] : value}
          style={{ marginLeft: 5 }}
        />
      </View>
    </View>
  );
};

export default TwoPicker;

const css = StyleSheet.create({
  container: {},
  title: {
    textTransform: "uppercase",
    fontFamily: w400,
    marginBottom: 5,
    marginTop: 10,
    marginLeft: 3,
    color: dark,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    flexDirection: "row",
    position: "relative",
  },
  icon: {
    position: "absolute",
    zIndex: 2,
    top: "50%",
    left: 5,
    transform: [{ translateY: -12 }],
  },
  checkIcon: {
    position: "absolute",
    zIndex: 2,
    top: "50%",
    right: 5,
    transform: [{ translateY: -11 }],
  },
  input: {
    backgroundColor: light,
    color: dark,
    fontFamily: w400,
    paddingTop: 5,
    paddingBottom: 4,
    borderRadius: 5,
    flex: 1,
  },
  error: {
    color: "#DE4839",
    fontFamily: w400,
  },
});
