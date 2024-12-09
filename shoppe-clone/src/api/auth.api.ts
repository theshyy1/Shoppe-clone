import { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'
import { formSchemaType } from 'src/utils/validate'

type LoginSchemaType = Pick<formSchemaType, 'email' | 'password'>

const AuthAPI = {
  registerAccount: (body: LoginSchemaType) => http.post<AuthResponse>('register', body),
  LoginAccount: (body: LoginSchemaType) => http.post<AuthResponse>('login', body),
  LogoutAccount: () => http.post('logout')
}

export default AuthAPI
