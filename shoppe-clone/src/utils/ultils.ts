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

export const percentSale = (oldPrice: number, newPrice: number) => Math.round(((oldPrice - newPrice) / oldPrice) * 100)

export const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i.${id}`
}

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i.')
  return arr[arr.length - 1]
}
