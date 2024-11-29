import axios, { AxiosError } from 'axios'
import { HttpStatusCode } from 'src/constants/HttpStatusCode'

export function isAxiosError<T>(err: unknown): err is AxiosError<T> {
  //type predicate
  return axios.isAxiosError(err)
}

export function isAxios422Error<FormError>(err: unknown): err is AxiosError<FormError> {
  return isAxiosError(err) && err.response?.status === HttpStatusCode.UnprocessableEntity
}

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}

export function formatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat('en', {
    maximumFractionDigits: 1,
    notation: 'compact'
  })
    .format(value)
    .replace('.', ',')
    .toLocaleLowerCase()
}
