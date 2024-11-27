import { SuccessResponse } from 'src/types/ultil.type'
import { User } from 'src/types/user.type'

export type AuthResponse = SuccessResponse<{
  access_token: string
  expires: string
  user: User
}>
