import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useLayoutEffect,
} from "react"
import { UserFriend, UserProfileSchema } from "../@types/types"
import Cookies from "js-cookie"
import { useQuery } from "@tanstack/react-query"
import api from "../lib/api"

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

  userFriendList: UserFriend[]
  setUserFriendList: Dispatch<SetStateAction<UserFriend[]>>

  handleWithUserNoAuthInformations: () => void
}

export const UserContextProvider = createContext<UserContextInterface>(
  {} as UserContextInterface
)

const UserContext = ({ children }: UserContextProviderProps) => {
  const [openLoginModal, setOpenLoginModal] = useState(false)
  const [openRegisterModal, setOpenRegisterModal] = useState(false)
  const [openForgotPassModal, setOpenForgotPassModal] = useState(false)

  const [userFriendList, setUserFriendList] = useState<UserFriend[]>([])
  const [userProfile, setUserProfile] = useState<UserProfileSchema | null>(null)

  const userAuthToken = Cookies.get("chatapp-token")

  useQuery({
    queryKey: ["getUserProfile"],
    queryFn: async () => {
      const getProfileRes = await api.get("/profile", {
        headers: {
          Authorization: `Bearer ${userAuthToken}`,
        },
      })

      setUserProfile({
        ...getProfileRes.data,
        token: userAuthToken,
      })

      return getProfileRes.data
    },
    enabled: Boolean(userAuthToken),
  })

  useQuery({
    queryKey: ["getUserFriendList"],
    queryFn: async () => {
      const { data } = await api.get("/profile/friend-list", {
        headers: {
          Authorization: `Bearer ${userAuthToken}`,
        },
      })

      setUserFriendList(data)

      return data
    },
    enabled: Boolean(userAuthToken),
  })

  function handleWithUserNoAuthInformations() {
    const userNoAuthFriendList = localStorage.getItem("chat-app-FL")

    if (userNoAuthFriendList) {
      const parseUserFriendList = JSON.parse(userNoAuthFriendList)

      if (parseUserFriendList) {
        setUserFriendList(parseUserFriendList)
      }
    }
  }

  useLayoutEffect(() => {
    if (!userAuthToken) {
      handleWithUserNoAuthInformations()
    }
  }, [window.location.href, userAuthToken])

  return (
    <UserContextProvider.Provider
      value={{
        openLoginModal,
        openRegisterModal,
        openForgotPassModal,
        userProfile,
        userFriendList,
        setUserFriendList,
        handleWithUserNoAuthInformations,
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
