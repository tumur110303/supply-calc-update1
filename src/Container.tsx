import { FC, useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { io } from "socket.io-client";

const socket = io("http://13.250.116.121:8000/");

const Container: FC = ({ children }) => {
  return <>{children}</>;
};

export default Container;

const css = StyleSheet.create({});
