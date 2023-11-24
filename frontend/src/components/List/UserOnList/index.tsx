import { useState, useContext } from "react"
import MiniProfileModal from "../../MiniProfileModal"
import s from "./styles.module.css"
import { ChatContextProvider } from "../../../context/chatContext"
interface UserOnListProps {
  user: { id: string; username: string; auth: boolean }
}

const UserOnList = ({ user }: UserOnListProps) => {
  const { myId, setOpenedProfile } = useContext(ChatContextProvider)

  const [toggleProfile, setToggleProfile] = useState(false)

  const handleOpenUserProfile = (userId: string) => {
    if (userId !== myId?.id) {
      setOpenedProfile(userId)
      setToggleProfile(!toggleProfile)
    }
  }

  return (
    <div className={s.user}>
      <button
        onClick={() => handleOpenUserProfile(user.id)}
        type="button"
        className={`${s.profileTrigger} ${user.id === myId?.id ? s.me : ""}`}
      >
        {user.username}
      </button>

      <MiniProfileModal toggleProfile={toggleProfile} user={user} />
    </div>
  )
}

export default UserOnList
