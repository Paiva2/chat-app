import { Unlock } from "lucide-react"
import s from "../styles.module.css"

interface PrivateMessageButtonProps {
  openPrivateMessage: () => void
}

const PrivateMessageButton = ({ openPrivateMessage }: PrivateMessageButtonProps) => {
  return (
    <button
      className={s.privateMsgButton}
      onClick={openPrivateMessage}
      type="button"
    >
      Private message{" "}
      <span>
        <Unlock size={15} color="#fff" />
      </span>
    </button>
  )
}

export default PrivateMessageButton
