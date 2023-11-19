import { Unlock, UserPlus2, X } from "lucide-react"
import { ChatContextProvider } from "../../../context/chatContext"
import { useQuery } from "@tanstack/react-query"
import { useState, useContext, useEffect } from "react"
import { FetchUserSchema } from "../../../@types/types"
import { AxiosError } from "axios"
import api from "../../../lib/api"
import Cookies from "js-cookie"
import s from "../styles.module.css"

interface UserOnListProps {
  user: { id: string; username: string; auth: boolean }
}

const UserOnList = ({ user }: UserOnListProps) => {
  const {
    myId,
    openedProfiles,
    whoIsReceivingPrivate,
    privateMessagesList,
    setPrivateMessages,
    setOpenedProfiles,
    setActiveMenu,
    setWhoIsReceivingPrivate,
  } = useContext(ChatContextProvider)

  const [openUserProfile, setOpenUserProfile] = useState(false)
  const [toggleProfile, setToggleProfile] = useState(false)
  const [apiLoading, setApiLoading] = useState(false)

  const handleOpenUserProfile = (userId: string) => {
    if (userId !== myId?.id) {
      setOpenedProfiles(userId)
      setToggleProfile(!toggleProfile)
    }
  }

  useEffect(() => {
    if (user?.id === openedProfiles) {
      setOpenUserProfile(!openUserProfile)
    } else {
      setOpenUserProfile(false)
    }
  }, [openedProfiles, toggleProfile])

  const handleOpenPrivateMessage = () => {
    setActiveMenu("Messages")

    setWhoIsReceivingPrivate({
      ...whoIsReceivingPrivate,
      to: {
        id: user.id,
        username: user.username,
      },
    })

    const checkIfUserHasConversationsPreviously = privateMessagesList.filter(
      (message) => {
        return (
          message.connections.includes(user.id) &&
          message.connections.includes(myId?.id as string)
        )
      }
    )

    if (checkIfUserHasConversationsPreviously.length) {
      setPrivateMessages(checkIfUserHasConversationsPreviously[0].data)
    }

    setOpenedProfiles("")
  }

  const { data: clickedUserData } = useQuery({
    queryKey: ["getClickedUserOnListData"],
    queryFn: async () => {
      const { data } = await api.get(`/user/${user.id}`)

      return data as FetchUserSchema | null
    },
    enabled: Boolean(user.id) && user.auth && user.id !== myId?.id,
    retry: false,
    refetchOnMount: true,
  })

  async function handleFriend(
    userId: string,
    userUsername: string,
    userProfilePic: string,
    action: "insert" | "remove"
  ) {
    if (action === "insert") {
      if (myId?.auth) {
        const getAuthToken = Cookies.get("chatapp-token")

        if (!getAuthToken) throw new Error("Invalid token.")

        setApiLoading(true)

        try {
          await api.post(
            "/friend",
            {
              id: userId,
              username: userUsername,
              profilePicture: userProfilePic,
            },
            {
              headers: {
                Authorization: `Bearer ${getAuthToken}`,
              },
            }
          )
        } catch (e) {
          if (e instanceof AxiosError) {
            console.error(e)
          }
        } finally {
          setApiLoading(false)
        }
      }
    }
  }

  if (!user) return <></>

  const defaultImage = "https://i.imgur.com/jOkraDo.png"

  const determineProfilePicture = user.auth
    ? clickedUserData?.profileImage ?? defaultImage
    : defaultImage

  return (
    <div onClick={() => handleOpenUserProfile(user.id)} className={s.user}>
      <li key={user.id}>{user.username}</li>
      <span
        onClick={(e) => e.stopPropagation()}
        className={`${s.miniUserProfile} ${
          openUserProfile ? s.visibleMiniProfile : ""
        }`}
      >
        <div className={s.topProfile}>
          <span className={s.userName}>{user.username}</span>
          <button
            onClick={() => {
              setOpenedProfiles("")
              setOpenUserProfile(false)
            }}
            className={s.closeProfileButton}
            type="button"
          >
            <X size={22} />
          </button>

          <button
            disabled={apiLoading}
            onClick={() =>
              handleFriend(user.id, user.username, determineProfilePicture, "insert")
            }
            className={s.addAsFriendButton}
            type="button"
          >
            <UserPlus2 size={22} color="#fff" />
          </button>
        </div>
        <div className={s.avatarPicture}>
          <img alt="Profile Picture" src={determineProfilePicture} />
        </div>

        <ul className={s.userActionList}>
          <li>
            <button
              className={s.privateMsgButton}
              onClick={handleOpenPrivateMessage}
              type="button"
            >
              Private message{" "}
              <span>
                <Unlock size={15} color="#fff" />
              </span>
            </button>
          </li>
        </ul>
      </span>
    </div>
  )
}

export default UserOnList
