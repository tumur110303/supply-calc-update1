import { createContext } from "react";

const SetCount = createContext<React.Dispatch<
  React.SetStateAction<number>
> | null>(null);

export default SetCount;
