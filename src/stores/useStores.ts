import { useContext } from "react";

import { StoreContext } from "./Provider";

export const useStores = () => {
  return useContext(StoreContext);
};
