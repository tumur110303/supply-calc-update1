import { Text, View, TextInput } from "react-native";
import { FC } from "react";
import { w400 } from "../../constants";
import Switch from "./Switch";

type Props = {
  onValueChange: (value: boolean) => void;
  value?: boolean;
  label?: string;
  innerText?: [string, string];
};

const OnOffSwitch: FC<Props> = (props) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        marginHorizontal: 10,
        marginTop: 15,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          paddingTop: 10,
          color: "#333",
          fontFamily: w400,
          textTransform: "uppercase",
        }}
      >
        {props.label}
      </Text>
      <Switch
        onPress={props.onValueChange}
        value={props.value ? props.value : false}
        innerText={props.innerText}
      />
    </View>
  );
};

export default OnOffSwitch;
