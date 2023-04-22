import React, { createContext } from "react";

const CountContext = createContext<{
  count: number;
  increase: () => Promise<void>;
}>({
  count: 0,
  increase: async () => {},
});

export default CountContext;
