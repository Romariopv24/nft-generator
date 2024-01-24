import axios from "axios"
import { URL } from "../constantes"

class Api {
  axiosConfig = {
    baseURL: `${URL}`,
    responseType: "json",
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Access-Control-Allow-Origin": true,
      Pragma: "no-cache",
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    }
  }

  async get(url = this.axiosConfig.baseURL, headers) {
    const fetcher = axios.create(this.axiosConfig)
    const response = await fetcher.get(url, headers)
    return response
  }

  async post(url = this.axiosConfig.baseURL, data, headers) {
    const fetcher = axios.create(this.axiosConfig)
    const response = await fetcher.post(url, data, headers)
    return response
  }
}

export const axiosClass = new Api()