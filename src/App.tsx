import { Navigate, Route, Routes } from "react-router-dom";

import { SHOP_TAB_ROUTES } from "@/consts";
import ShopPage from "@/pages/ShopPage";

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate replace to={SHOP_TAB_ROUTES.PREMIUM} />}
      />
      <Route path={SHOP_TAB_ROUTES.PREMIUM} element={<ShopPage />} />
      <Route path={SHOP_TAB_ROUTES.COLLECTION} element={<ShopPage />} />
      <Route
        path="*"
        element={<Navigate replace to={SHOP_TAB_ROUTES.PREMIUM} />}
      />
    </Routes>
  );
};

export default App;
