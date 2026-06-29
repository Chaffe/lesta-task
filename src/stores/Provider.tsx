import { createContext, ReactNode } from "react";

import { RootStore } from "./store";

export const StoreContext = createContext(RootStore);

type StoreWrapperProps = {
  children: ReactNode;
};

export const StoreWrapper = ({ children }: StoreWrapperProps) => {
  return (
    <StoreContext.Provider value={RootStore}>{children}</StoreContext.Provider>
  );
};
