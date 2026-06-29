import { IconName } from "@/components/Icon";

export enum SHOP_TAB_TITLES {
  PREMIUM = "Премиальная",
  COLLECTION = "Коллекционная",
}

export enum SHOP_TAB_ROUTES {
  PREMIUM = "/premium",
  COLLECTION = "/collection",
}

export const SHOP_TABS = [
  { id: 1, title: SHOP_TAB_TITLES.PREMIUM, route: SHOP_TAB_ROUTES.PREMIUM },
  {
    id: 2,
    title: SHOP_TAB_TITLES.COLLECTION,
    route: SHOP_TAB_ROUTES.COLLECTION,
  },
];

export const SHOP_TAB_TITLE_BY_ROUTE: Record<SHOP_TAB_ROUTES, SHOP_TAB_TITLES> =
  {
    [SHOP_TAB_ROUTES.PREMIUM]: SHOP_TAB_TITLES.PREMIUM,
    [SHOP_TAB_ROUTES.COLLECTION]: SHOP_TAB_TITLES.COLLECTION,
  };

export const SORTING_BUTTONS: {
  id: number;
  icon: IconName;
  vehicle_type: string;
}[] = [
  { id: 1, icon: "LightTankIcon", vehicle_type: "lightTank" },
  { id: 2, icon: "MediumTankIcon", vehicle_type: "mediumTank" },
  { id: 3, icon: "HeavyTankIcon", vehicle_type: "heavyTank" },
  { id: 4, icon: "SPGIcon", vehicle_type: "SPG" },
  { id: 5, icon: "ATSPGIcon", vehicle_type: "AT-SPG" },
];
