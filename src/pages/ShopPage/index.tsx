import { observer } from "mobx-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

import styles from "./ShopPage.module.scss";

import Header from "@/layout/Header";
import VehicleList from "@/containers/VehicleList";
import { useStores } from "@/stores/useStores";
import { SHOP_TAB_ROUTES, SHOP_TAB_TITLE_BY_ROUTE } from "@/consts";

const ShopPage = observer(() => {
  const location = useLocation();
  const { vehiclesStore } = useStores();

  useEffect(() => {
    const tab = SHOP_TAB_TITLE_BY_ROUTE[location.pathname as SHOP_TAB_ROUTES];

    if (!tab) {
      return;
    }

    vehiclesStore.setActiveTab(tab);
  }, [location.pathname, vehiclesStore]);

  return (
    <div className={styles.shopPage}>
      <div className={styles.layout}>
        <Header />
        <VehicleList />
      </div>
    </div>
  );
});

export default ShopPage;
