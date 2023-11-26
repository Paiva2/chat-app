import { useContext } from "react"
import { ArrowLeftToLine } from "lucide-react"
import ChatBox from "../ChatBox"
import List from "../List"
import s from "./styles.module.css"
import { ChatContextProvider } from "../../context/chatContext"

const ChatComponent = () => {
  const { setShowListMobile } = useContext(ChatContextProvider)

  return (
    <div className={s.chatComponentWrapper}>
      <button
        onClick={() => setShowListMobile(true)}
        className={s.openMenuSideButton}
      >
        <ArrowLeftToLine color="#fff" size={22} />
      </button>
      <ChatBox />
      <List />
    </div>
  )
}

export default ChatComponent
