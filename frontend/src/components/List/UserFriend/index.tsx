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
  const { myId, setOpenedProfiles } = useContext(ChatContextProvider)

  const [toggleProfile, setToggleProfile] = useState(false)

  const handleOpenUserProfile = (userId: string) => {
    if (userId !== myId?.id) {
      setOpenedProfiles(userId)
      setToggleProfile(!toggleProfile)
    }
  }

  return (
    <li className={s.privateCard}>
      <div className={s.userProfile}>
        <div className={s.userInformations}>
          <div className={s.cardLeftSide}>
            <img
              src={friend?.profileImage ?? "https://i.imgur.com/jOkraDo.png"}
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
      <span
        style={{
          fontSize: "12px",
          paddingTop: 0,
          display: "flex",
          alignItems: "center",
          gap: "5px",
          position: "absolute",
          top: "4px",
          left: "10px",
        }}
      >
        <span
          style={{
            display: "flex",
            width: "8px",
            borderRadius: "100%",
            height: "8px",
            backgroundColor: "green",
          }}
        />{" "}
        Online
      </span>
    </li>
  )
}

export default UserFriend
