import { useContext, useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { FetchUserSchema, UserFriend } from "../../@types/types"
import { ChatContextProvider } from "../../context/chatContext"
import { UserContextProvider } from "../../context/userContext"
import { X } from "lucide-react"
import PrivateMessageButton from "./PrivateMessageButton"
import FriendActionButton from "./FriendActionButton"
import getLocalStorage from "../../utils/getLocalStorage"
import api from "../../lib/api"
import s from "./styles.module.css"

interface MiniProfileModalProps {
  user: { id: string; username: string; auth?: boolean }
  toggleProfile?: boolean
}

const MiniProfileModal = ({ user, toggleProfile }: MiniProfileModalProps) => {
  const {
    myId,
    openedProfile,
    whoIsReceivingPrivate,
    privateMessagesList,
    setPrivateMessages,
    setOpenedProfile,
    setActiveMenu,
    setWhoIsReceivingPrivate,
  } = useContext(ChatContextProvider)

  const { userProfile, userFriendList, setUserFriendList } =
    useContext(UserContextProvider)

  const [openUserProfile, setOpenUserProfile] = useState(false)

  const queryClient = useQueryClient()

  const defaultImage = "https://i.postimg.cc/hjvSCcM3/jOkraDo.png"

  const { data: clickedUserData } = useQuery({
    queryKey: ["getClickedUserOnListData"],
    queryFn: async () => {
      const { data } = await api.get(`/user/${user.id}`)

      return data as FetchUserSchema | null
    },
    enabled:
      Boolean(user.id) && user.auth && user.id !== myId?.id && openUserProfile,
    retry: false,
    refetchOnMount: true,
  })

  useEffect(() => {
    if (user?.id === openedProfile) {
      setOpenUserProfile(!openUserProfile)
    } else {
      setOpenUserProfile(false)
    }
  }, [openedProfile, toggleProfile])

  const handleOpenPrivateMessage = () => {
    setActiveMenu("Messages")

    setWhoIsReceivingPrivate({
      ...whoIsReceivingPrivate,
      to: {
        id: user.id,
        username: user.username,
        profilePicture: clickedUserData?.profileImage ?? defaultImage,
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

    setOpenedProfile("")
  }

  const insertNewFriend = useMutation({
    mutationKey: ["friendInsertion"],
    mutationFn: (friend: {
      userId: string
      userUsername: string
      userProfilePic: string
    }) => {
      if (!userProfile?.token) throw new Error("Invalid token.")

      return api.post(
        "/friend",
        {
          id: friend.userId,
          username: friend.userUsername,
          profilePicture: friend.userProfilePic,
        },
        {
          headers: {
            Authorization: `Bearer ${userProfile?.token}`,
          },
        }
      )
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserFriendList"] })
    },
  })

  const removeFriend = useMutation({
    mutationKey: ["friendRemoval"],
    mutationFn: (friendId: string) => {
      if (!userProfile?.token) throw new Error("Invalid token.")

      return api.delete("/friend", {
        data: {
          friendId: friendId,
        },

        headers: {
          Authorization: `Bearer ${userProfile?.token}`,
        },
      })
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserFriendList"] })
    },
  })

  function insertNewFriendForNoAuthUser(friend: {
    userId: string
    userUsername: string
    userProfilePic: string
    auth: boolean
  }) {
    const getUserFriends = getLocalStorage("chat-app-FL") as UserFriend[]

    const newFriend = {
      id: friend.userId,
      username: friend.userUsername,
      profileImage: friend.userProfilePic,
      addedAt: new Date(),
      auth: friend.auth,
      fkUser: myId?.id as string,
    }

    if (!getUserFriends) {
      const newFriendList: UserFriend[] = []

      newFriendList.push(newFriend)

      localStorage.setItem("chat-app-FL", JSON.stringify(newFriendList))

      setUserFriendList(newFriendList)

      return
    }

    const doesUserAlreadyHasThisFriend = getUserFriends.find(
      (friendsOnList) =>
        friendsOnList.id === friend.userId && friendsOnList.fkUser === myId?.id
    )

    if (doesUserAlreadyHasThisFriend) {
      throw new Error("User already has this friend on list.")
    } else {
      getUserFriends.push(newFriend)

      localStorage.setItem("chat-app-FL", JSON.stringify(getUserFriends))

      setUserFriendList(getUserFriends)
    }
  }

  function removeFriendForNoAuthUser(friendId: string) {
    const getAllUserFriends = getLocalStorage("chat-app-FL") as UserFriend[]

    if (!getAllUserFriends) {
      throw new Error("User has no friends on storage.")
    }

    const filterFriendFromList = getAllUserFriends.filter(
      (friend) => friend.id !== friendId
    )

    localStorage.setItem("chat-app-FL", JSON.stringify(filterFriendFromList))

    const parsedUserFriendsAfterUpdate = getLocalStorage(
      "chat-app-FL"
    ) as UserFriend[]

    setUserFriendList(parsedUserFriendsAfterUpdate)
  }

  async function friendSituation(
    userId: string,
    userUsername: string,
    userProfilePic: string,
    auth: boolean,
    action: "insert" | "remove"
  ) {
    const newFriend = {
      userId,
      userUsername,
      userProfilePic,
      auth,
    }

    switch (action) {
      case "insert": {
        if (myId?.auth) {
          insertNewFriend.mutate(newFriend)
        } else {
          insertNewFriendForNoAuthUser(newFriend)
        }

        break
      }

      case "remove": {
        if (myId?.auth) {
          removeFriend.mutate(userId)
        } else {
          removeFriendForNoAuthUser(userId)
        }

        break
      }

      default:
        null
    }
  }

  function checkIfUserIsFriend(friendId: string) {
    const doesFriendIsAdded = userFriendList.some((friend) => friend.id === friendId)

    if (!doesFriendIsAdded) return null

    return doesFriendIsAdded
  }

  if (!user) return <></>

  const determineProfilePicture = user.auth
    ? clickedUserData?.profileImage ?? defaultImage
    : defaultImage

  const isUserAddedAsFriend = checkIfUserIsFriend(user.id)

  const setFriendAction = isUserAddedAsFriend ? "remove" : "insert"

  function handleFriend() {
    friendSituation(
      user.id,
      user.username,
      determineProfilePicture,
      Boolean(user.auth),
      setFriendAction
    )
  }

  return (
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
            setOpenedProfile("")
            setOpenUserProfile(false)
          }}
          className={s.closeProfileButton}
          type="button"
        >
          <X size={22} />
        </button>

        <FriendActionButton
          handleFriend={handleFriend}
          isUserAnFriend={isUserAddedAsFriend}
          operationsPending={insertNewFriend.isPending || removeFriend.isPending}
        />
      </div>
      <div className={s.avatarPicture}>
        <img alt="Profile Picture" src={determineProfilePicture} />
      </div>

      <ul className={s.userActionList}>
        <li>
          <PrivateMessageButton openPrivateMessage={handleOpenPrivateMessage} />
        </li>
      </ul>
    </span>
  )
}

export default MiniProfileModal
