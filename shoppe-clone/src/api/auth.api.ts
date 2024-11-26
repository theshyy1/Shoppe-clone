import { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'
import { LoginSchemaType } from 'src/utils/validate'

export const registerAccount = (body: LoginSchemaType) => http.post<AuthResponse>('register', body)

export const LoginAccount = (body: LoginSchemaType) => http.post<AuthResponse>('login', body)
