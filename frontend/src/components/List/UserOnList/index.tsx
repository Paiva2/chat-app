import { Unlock, UserPlus2, X } from "lucide-react"
import { ChatContextProvider } from "../../../context/chatContext"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState, useContext, useEffect } from "react"
import { FetchUserSchema, UserFriend } from "../../../@types/types"
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

  const defaultImage = "https://i.imgur.com/jOkraDo.png"

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

  const insertNewFriend = useMutation({
    mutationKey: ["friendInsertion"],
    mutationFn: async (friend: {
      userId: string
      userUsername: string
      userProfilePic: string
    }) => {
      const getAuthToken = Cookies.get("chatapp-token")

      if (!getAuthToken) throw new Error("Invalid token.")

      const insertionResponse = await api.post(
        "/friend",
        {
          id: friend.userId,
          username: friend.userUsername,
          profilePicture: friend.userProfilePic,
        },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken}`,
          },
        }
      )

      return insertionResponse
    },
  })

  function insertNewFriendForNoAuthUser(friend: {
    userId: string
    userUsername: string
    userProfilePic: string
  }) {
    const doesUserHasFriends = localStorage.getItem("chat-app-FL")
    const newFriend = {
      id: friend.userId,
      username: friend.userUsername,
      profileImage: friend.userProfilePic,
      addedAt: new Date(),
      fkUser: myId?.id as string,
    }

    if (!doesUserHasFriends) {
      const friendList: UserFriend[] = []

      friendList.push(newFriend)

      localStorage.setItem("chat-app-FL", JSON.stringify(friendList))

      return
    }

    const getUserFriends: UserFriend[] = JSON.parse(doesUserHasFriends)

    const doesUserAlreadyHasThisFriend = getUserFriends.find(
      (friendsOnList) =>
        friendsOnList.id === friend.userId && friendsOnList.fkUser === myId?.id
    )

    if (doesUserAlreadyHasThisFriend) {
      throw new Error("User already has this friend on list.")
    } else {
      getUserFriends.push(newFriend)

      localStorage.setItem("chat-app-FL", JSON.stringify(getUserFriends))
    }
  }

  async function handleFriend(
    userId: string,
    userUsername: string,
    userProfilePic: string,
    action: "insert" | "remove"
  ) {
    const newFriend = {
      userId,
      userUsername,
      userProfilePic,
    }

    if (action === "insert") {
      if (myId?.auth) {
        insertNewFriend.mutateAsync(newFriend)
      } else {
        insertNewFriendForNoAuthUser(newFriend)
      }
    }
  }

  if (!user) return <></>

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
            disabled={insertNewFriend.isPending}
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
