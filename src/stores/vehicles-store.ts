import { makeAutoObservable } from "mobx";

import { SHOP_TAB_TITLES } from "@/consts";
import VehiclesService from "@/services/vehicles.service";
import { VehicleType } from "@/types/vehicles-types";

export type PriceSortDirection = "asc" | "desc";

class VehiclesStore {
  private _loading = false;
  private _allVehicles: VehicleType[] = [];
  private _activeTab: SHOP_TAB_TITLES = SHOP_TAB_TITLES.PREMIUM;
  private _priceSortDirection: PriceSortDirection = "desc";
  private _isPriceSortHighlighted = false;
  private _selectedVehicleTypes: string[] = [];
  private _expandedVehicleId: string | null = null;
  private _loadVehiclesPromise: Promise<VehicleType[]> | null = null;

  constructor(private readonly service: VehiclesService) {
    makeAutoObservable(this);
  }

  loadVehicles = (): Promise<VehicleType[]> => {
    if (this._loadVehiclesPromise) {
      return this._loadVehiclesPromise;
    }

    this._loadVehiclesPromise = this.fetchVehicles();

    return this._loadVehiclesPromise;
  };

  private fetchVehicles = async (): Promise<VehicleType[]> => {
    this._loading = true;

    try {
      const { data } = await this.service.getVehicles();
      this._allVehicles = data;
    } catch (error) {
      console.error("loadVehicles error:", error);
      this._allVehicles = [];
      this._loadVehiclesPromise = null;
    } finally {
      this._loading = false;
    }

    return this._allVehicles;
  };

  setActiveTab = (tab: SHOP_TAB_TITLES) => {
    if (this._activeTab === tab) {
      return;
    }

    this._activeTab = tab;
    this._expandedVehicleId = null;
  };

  togglePriceSort = () => {
    this._isPriceSortHighlighted = true;
    this._priceSortDirection =
      this._priceSortDirection === "desc" ? "asc" : "desc";
  };

  toggleVehicleType = (vehicleType: string) => {
    if (this._selectedVehicleTypes.includes(vehicleType)) {
      this._selectedVehicleTypes = this._selectedVehicleTypes.filter(
        (type) => type !== vehicleType,
      );
    } else {
      this._selectedVehicleTypes = [...this._selectedVehicleTypes, vehicleType];
    }

    this._expandedVehicleId = null;
  };

  toggleExpandedVehicle = (vehicleId: string) => {
    this._expandedVehicleId =
      this._expandedVehicleId === vehicleId ? null : vehicleId;
  };

  collapseExpandedVehicle = () => {
    this._expandedVehicleId = null;
  };

  isVehicleTypeSelected = (vehicleType: string): boolean => {
    return this._selectedVehicleTypes.includes(vehicleType);
  };

  get vehicles(): VehicleType[] {
    const isPremiumTab = this._activeTab === SHOP_TAB_TITLES.PREMIUM;

    let result = this._allVehicles.filter(
      (vehicle) => vehicle.premium === isPremiumTab,
    );

    if (this._selectedVehicleTypes.length > 0) {
      result = result.filter((vehicle) =>
        this._selectedVehicleTypes.includes(vehicle.vehicle_type),
      );
    }

    return [...result].sort((first, second) => {
      if (this._priceSortDirection === "desc") {
        return second.price - first.price;
      }

      return first.price - second.price;
    });
  }

  get priceSortDirection(): PriceSortDirection {
    return this._priceSortDirection;
  }

  get isPriceSortHighlighted(): boolean {
    return this._isPriceSortHighlighted;
  }

  get expandedVehicleId(): string | null {
    return this._expandedVehicleId;
  }

  get loading(): boolean {
    return this._loading;
  }
}

export default VehiclesStore;
