import { useContext, useState } from "react"
import MiniProfileModal from "../../MiniProfileModal"
import { UserFriend as UserFriendType } from "../../../@types/types"
import s from "./styles.module.css"
import { ChatContextProvider } from "../../../context/chatContext"
import { MoreVertical } from "lucide-react"

interface UserFriendProps {
  friend: UserFriendType
}

const UserFriend = ({ friend }: UserFriendProps) => {
  const { myId, setOpenedProfile, usersList } = useContext(ChatContextProvider)

  const [toggleProfile, setToggleProfile] = useState(false)

  const handleOpenUserProfile = (userId: string) => {
    if (userId !== myId?.id) {
      setOpenedProfile(userId)
      setToggleProfile(!toggleProfile)
    }
  }

  const isUserOnline = usersList.some((user) => user.id === friend.id)

  return (
    <li className={s.privateCard}>
      <div className={s.userProfile}>
        <div className={s.userInformations}>
          <div className={s.cardLeftSide}>
            <img
              src={
                friend?.profileImage ?? "https://i.postimg.cc/hjvSCcM3/jOkraDo.png"
              }
              className={s.userImage}
            />
            <span className={s.userInfos}>
              <p>{friend.username}</p>
            </span>
          </div>
        </div>

        <button
          className={s.miniProfileTrigger}
          onClick={() => handleOpenUserProfile(friend.id)}
          type="button"
        >
          <MoreVertical color="#696391" size={22} />
        </button>
      </div>
      <MiniProfileModal toggleProfile={toggleProfile} user={friend} />
      <span className={`${s.userConnection}`}>
        <span className={`${isUserOnline ? s.on : s.off}`} />{" "}
        {isUserOnline ? "Online" : "Offline"}
      </span>
    </li>
  )
}

export default UserFriend
