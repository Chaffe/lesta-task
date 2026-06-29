import BaseHttpService from "./base-http.service";

import { Endpoints } from "@/consts/endpoints";
import { VehicleListResponseType } from "@/types/vehicles-types";

const MOCK_REQUEST_DELAY_MS = 300;

export default class VehiclesService extends BaseHttpService {
  async getVehicles(): Promise<VehicleListResponseType> {
    await this.simulateNetworkDelay();

    return this.get<VehicleListResponseType>(Endpoints.vehiclesEndpoints.list);
  }

  private simulateNetworkDelay(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, MOCK_REQUEST_DELAY_MS);
    });
  }
}
