import { StyleSheet, Text, View, TextInput } from "react-native";
import { FC } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Switch, TouchableRipple } from "react-native-paper";
import { main, w400 } from "../constants";

type Props = {
  icon?: string;
  onValueChange?: (value: boolean) => void;
  trueText?: string;
  falseText?: string;
  value?: boolean;
  label?: string;
};

const FormSwitch: FC<Props> = (props) => {
  return (
    <View style={{ marginHorizontal: 15 }}>
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
      <View
        style={{
          marginBottom: 5,
          flexDirection: "row",
          alignItems: "center",
          borderBottomColor: "#f2f2f2",
          borderBottomWidth: 1,
        }}
      >
        <MaterialCommunityIcons
          name={props.icon as any}
          size={20}
          color={"red"}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
            paddingLeft: 10,
          }}
        >
          <TouchableRipple onPress={() => props.onValueChange}>
            <Text style={{ color: "#333", fontFamily: w400 }}>
              {props.value ? props.trueText : props.falseText}
            </Text>
          </TouchableRipple>
          <Switch color={main} {...props} />
        </View>
      </View>
    </View>
  );
};

export default FormSwitch;
