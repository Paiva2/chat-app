import { UserPlus2, UserX2 } from "lucide-react"
import s from "../styles.module.css"

interface FriendActionButtonProps {
  operationsPending: boolean
  isUserAnFriend: true | null
  handleFriend: () => void
}

const FriendActionButton = ({
  operationsPending,
  isUserAnFriend,
  handleFriend,
}: FriendActionButtonProps) => {
  return (
    <button
      disabled={operationsPending}
      onClick={handleFriend}
      className={`${s.actionFriendButton} ${isUserAnFriend ? s.del : s.add}`}
      type="button"
    >
      {isUserAnFriend ? (
        <UserX2 key="remove" size={22} color="#fff" />
      ) : (
        <UserPlus2 key="add" size={22} color="#fff" />
      )}
    </button>
  )
}

export default FriendActionButton
