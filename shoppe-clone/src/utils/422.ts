import axios, { AxiosError } from 'axios'
import { HttpStatusCode } from 'src/constraint/HttpStatusCode'

export function isAxiosError<T>(err: unknown): err is AxiosError<T> {
  //type predicate
  return axios.isAxiosError(err)
}

export function isAxios422Error<FormError>(err: unknown): err is AxiosError<FormError> {
  return isAxiosError(err) && err.response?.status === HttpStatusCode.UnprocessableEntity
}
