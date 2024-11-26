import { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'

export interface IAccount {
  email: string
  password: string
}

export const registerAccount = (body: IAccount) => http.post<AuthResponse>('register', body)

export const LoginAccount = (body: IAccount) => http.post<AuthResponse>('login', body)
