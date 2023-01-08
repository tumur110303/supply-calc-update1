import { createContext } from "react";

const SetSubscription = createContext<React.Dispatch<
  React.SetStateAction<boolean>
> | null>(null);

export default SetSubscription;
