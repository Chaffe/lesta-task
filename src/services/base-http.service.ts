import axios, { AxiosRequestConfig } from "axios";

export default class BaseHttpService {
  get BASE_URL() {
    return import.meta.env.VITE_API_BASE_URL ?? "";
  }

  async get<T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<T> {
    const response = await axios.get<T>(`${this.BASE_URL}${endpoint}`, options);
    return response.data;
  }
}
