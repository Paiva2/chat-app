import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useLayoutEffect,
} from "react"
import { getUserProfile } from "../utils/getUserProfile"
import { UserFriend, UserProfileSchema } from "../@types/types"
/* import { useMutation } from "@tanstack/react-query"
 */ import Cookies from "js-cookie"
import { useQuery } from "@tanstack/react-query"
import api from "../lib/api"
/* import api from "../lib/api"
 */
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

  function handleWithUserAuthInformations(userAuthToken: string) {
    // eslint-disable-next-line
    ;(async () => {
      const getProfile = (await getUserProfile(
        userAuthToken as string
      )) as UserProfileSchema

      setUserProfile({
        ...getProfile,
        token: userAuthToken,
      })
    })()
  }

  function handleWithUserNoAuthInformations() {
    const userNoAuthListStorage = localStorage.getItem("chat-app-FL")

    if (userNoAuthListStorage) {
      const parseUserList = JSON.parse(userNoAuthListStorage)

      if (parseUserList) {
        setUserFriendList(parseUserList)
      }
    }
  }

  useLayoutEffect(() => {
    if (userAuthToken) {
      handleWithUserAuthInformations(userAuthToken)
    } else {
      handleWithUserNoAuthInformations()
    }
  }, [window.location.href])

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
