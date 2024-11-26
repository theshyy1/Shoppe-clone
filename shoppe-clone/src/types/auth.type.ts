import { ResponseAPI } from 'src/types/ultil.type'
import { User } from 'src/types/user.type'

export type AuthResponse = ResponseAPI<{
  access_token: string
  expires: string
  user: User
}>
