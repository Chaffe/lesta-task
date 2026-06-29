export interface VehicleListResponseType {
  data: VehicleType[];
}

export interface VehicleType {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: number;
  price: number;
  old_price: number;
  vehicle_type: string;
  premium: boolean;
}
