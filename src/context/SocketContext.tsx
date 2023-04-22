import { createContext, FC, useState } from "react";
import { Socket } from "socket.io-client";
import axios from "../axios";

const SocketContext = createContext<Socket | null>(null);

export default SocketContext;
