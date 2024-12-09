import { SetStateAction, createContext, useState } from 'react'
import { ExtendedPurchases } from 'src/types/purchase.type'
import { User } from 'src/types/user.type'
import { getAccessToken, getProfileFromLS } from 'src/utils/auth'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<SetStateAction<User | null>>
  extendedPurchases: ExtendedPurchases[]
  setExtendedPurchases: React.Dispatch<SetStateAction<ExtendedPurchases[]>>
  reset: () => void
}

const initialState: AppContextInterface = {
  isAuthenticated: Boolean(getAccessToken()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  extendedPurchases: [],
  setExtendedPurchases: () => null,
  reset: () => null
}

export const AppContext = createContext<AppContextInterface>(initialState)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(initialState.profile)
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchases[]>([])

  const reset = () => {
    setIsAuthenticated(false)
    setExtendedPurchases([])
    setProfile(null)
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        extendedPurchases,
        setExtendedPurchases,
        reset
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
