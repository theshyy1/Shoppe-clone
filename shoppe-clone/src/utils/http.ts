import axios, { AxiosError, AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { HttpStatusCode } from 'src/constants/HttpStatusCode'
import { AuthResponse } from 'src/types/auth.type'
import { clearAccessToken, getAccessToken, saveAccessToken, saveProfileToLS } from 'src/utils/auth'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessToken()
    ;(this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })),
      // interceptors request
      this.instance.interceptors.request.use(
        (config) => {
          if (this.accessToken && config.headers) {
            config.headers['Authorization'] = this.accessToken
            return config
          }
          return config
        },
        (error) => {
          return Promise.reject(error)
        }
      ),
      // interceptors response
      this.instance.interceptors.response.use(
        (response) => {
          const { url } = response.config
          if (url === 'login' || url === 'register') {
            const data = response.data as AuthResponse
            this.accessToken = data.data.access_token
            saveAccessToken(this.accessToken)
            saveProfileToLS(data.data.user)
          } else if (url === 'logout') {
            this.accessToken = ''
            clearAccessToken()
          }
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

          if (error.response?.status === HttpStatusCode.Unauthorized) {
            clearAccessToken()
          }
          return Promise.reject(error)
        }
      )
  }
}

const http = new Http().instance

export default http
