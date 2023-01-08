import axios from "../axios";

const useIncreaseCount = (
  user?: string,
  setCount?: React.Dispatch<React.SetStateAction<number>>
) => {
  if (setCount) {
    setCount((state) => state + 1);
  }
  return async () => await axios.post("/user/count", { id: user });
};

export default useIncreaseCount;
