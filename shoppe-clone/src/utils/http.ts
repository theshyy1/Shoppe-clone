import axios, { AxiosError, AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { HttpStatusCode } from 'src/constraint/HttpStatusCode'

class Http {
  instance: AxiosInstance
  constructor() {
    ;(this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })),
      // interceptor response
      this.instance.interceptors.response.use(
        function (response) {
          return response
        },
        function (error: AxiosError) {
          if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
            const data: any | undefined = error.response?.data
            const message = data.message || error.message

            toast.error(message, {
              theme: 'colored'
            })
          }
          return Promise.reject(error)
        }
      )
  }
}

const http = new Http().instance

export default http
