import { Unlock, X } from "lucide-react"
import { ChatContextProvider } from "../../../context/chatContext"
import s from "../styles.module.css"
import { useState, useContext, useEffect } from "react"

interface UserOnListProps {
  user: { id: string; username: string }
}

const UserOnList = ({ user }: UserOnListProps) => {
  const { myId, openedProfiles, setOpenedProfiles, setActiveMenu } =
    useContext(ChatContextProvider)

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
          onClick={() => setActiveMenu("Messages")}
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
