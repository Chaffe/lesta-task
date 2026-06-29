import VehiclesStore from "./vehicles-store";

import VehiclesService from "@/services/vehicles.service";

const vehiclesStore = new VehiclesStore(new VehiclesService());

export const RootStore = {
  vehiclesStore,
};
