import axios from "axios"
import { URL } from "../constantes"

class Api {
  getToken() {
    return localStorage.getItem("access_token")
  }

  get axiosConfig() {
    return {
      baseURL: `${URL}`,
      responseType: "json",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": true,
        Pragma: "no-cache",
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`
      }
    }
  }

  get axiosConfigStripe() {
    return {
      baseURL: `${URL}`,
      responseType: "json",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": true,
        Pragma: "no-cache",
        Accept: "application/json",
        "Content-Type": "application/json"
        // Authorization: `Bearer ${this.getToken()}`
      }
    }
  }

  async get(url = this.axiosConfig.baseURL, headers = this.axiosConfig.headers) {
    const fetcher = axios.create(this.axiosConfig)
    const response = await fetcher.get(url, { headers })
    return response;
  }

  async post(url = this.axiosConfig.baseURL, data, headers = this.axiosConfig.headers) {
    const fetcher = axios.create(this.axiosConfig)
    const response = await fetcher.post(url, data, { headers })
    return response
  }

  async postStripe(url = this.axiosConfig.baseURL, data, headers = this.axiosConfigStripe.headers) {
    const fetcher = axios.create(this.axiosConfigStripe)
    const response = await fetcher.post(url, data, { headers })
    return response
  }

  async put(url = this.axiosConfig.baseURL, data, headers = this.axiosConfig.headers) {
    const fetcher = axios.create(this.axiosConfig)
    const response = await fetcher.put(url, data, { headers })
    return response
  }
}

export const axiosClass = new Api()