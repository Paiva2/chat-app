import { Unlock, X } from "lucide-react"
import { ChatContextProvider } from "../../../context/chatContext"
import s from "../styles.module.css"
import { useState, useContext, useEffect } from "react"

interface UserOnListProps {
  user: { id: string; username: string }
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

  if (!user) return <></>

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
          <span>{user.username}</span>
          <button
            onClick={() => {
              setOpenedProfiles("")
              setOpenUserProfile(false)
            }}
            className={s.closeProfileButton}
            type="button"
          >
            <X size={20} />
          </button>
        </div>
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
      </span>
    </div>
  )
}

export default UserOnList
