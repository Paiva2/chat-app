import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useLayoutEffect,
} from "react"
import Cookies from "js-cookie"
import { getUserProfile } from "../utils/getUserProfile"
import { UserProfileSchema } from "../@types/types"

interface UserContextProviderProps {
  children: React.ReactNode
}

interface UserContextInterface {
  openLoginModal: boolean
  setOpenLoginModal: Dispatch<SetStateAction<boolean>>

  openRegisterModal: boolean
  setOpenRegisterModal: Dispatch<SetStateAction<boolean>>

  openForgotPassModal: boolean
  setOpenForgotPassModal: Dispatch<SetStateAction<boolean>>

  userProfile: UserProfileSchema | null
  setUserProfile: Dispatch<SetStateAction<UserProfileSchema | null>>
}

export const UserContextProvider = createContext<UserContextInterface>(
  {} as UserContextInterface
)

const UserContext = ({ children }: UserContextProviderProps) => {
  const [openLoginModal, setOpenLoginModal] = useState(false)
  const [openRegisterModal, setOpenRegisterModal] = useState(false)
  const [openForgotPassModal, setOpenForgotPassModal] = useState(false)

  const [userProfile, setUserProfile] = useState<UserProfileSchema | null>(null)

  useLayoutEffect(() => {
    const isUserAuth = Cookies.get("chatapp-token")

    if (isUserAuth) {
      // eslint-disable-next-line
      ;(async () => {
        const getProfile = (await getUserProfile(
          isUserAuth as string
        )) as UserProfileSchema

        setUserProfile(getProfile)
      })()
    }
  }, [window.location.href])

  return (
    <UserContextProvider.Provider
      value={{
        openLoginModal,
        openRegisterModal,
        openForgotPassModal,
        userProfile,
        setUserProfile,
        setOpenForgotPassModal,
        setOpenRegisterModal,
        setOpenLoginModal,
      }}
    >
      {children}
    </UserContextProvider.Provider>
  )
}

export default UserContext
