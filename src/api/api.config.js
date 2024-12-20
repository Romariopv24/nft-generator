import axios from "axios"
import { URL, nfanstURL } from "../constantes"
import { jwtDecode } from "jwt-decode"



export const getHeaders = () => {
  return {
    baseURL: "https://api-nfanst-final.devtop.online/api/v1",
    responseType: "json",
    timeout: 300000,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "",
    },
  }
}

const headers = getHeaders()
headers.headers = {
  ...headers.headers,
  Authorization: `Bearer ${localStorage.getItem("NFansT Token")}`,
}


const renewToken = () => {
  axiosNfanst.get("/renewToken", headers).then((res) => {
    // localStorage.setItem("token", JSON.stringify(res.data.token?.replace(/(^"|"$)/g, "")))
    localStorage.setItem("NFansT Token", res.data.token)
  })
}

class Api {
  constructor(url) {
    this.url = url
  }

  async initializeInterceptors() {
    let isRenewingToken = false
    const token = localStorage.getItem("NFansT Token") || ""
    if(token) {
      axios.interceptors.request.use(
        async (config) => {
          const decodedToken = jwtDecode(token)
          const today = new Date()
          const sessionExp = new Date(decodedToken.exp * 1000 - 34 * 60 * 1000)

          if(token && today > sessionExp && !isRenewingToken) {
            isRenewingToken = true
            await this.renewToken()
            isRenewingToken = false
          }
          const updatedToken = localStorage.getItem("NFansT Token")

          config.headers.Authorization = `Bearer ${updatedToken}`
          console.log(updatedToken)
          return config

        },
        (error) => {
          return Promise.reject(error)
        }
      )
    }

  }
  

  get axiosConfig() {
    const token =  localStorage.getItem("access_token")
    return {
      baseURL: this.url,
      responseType: "json",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": true,
        Pragma: "no-cache",
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  }

  get axiosConfigStripe() {
    return {
      baseURL: this.url,
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

export const axiosClass = new Api(URL)
export const axiosNfanst = new Api(nfanstURL)