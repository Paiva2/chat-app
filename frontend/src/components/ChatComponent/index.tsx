import ChatContext from "../../context/chatContext"
import ChatBox from "../ChatBox"
import OnlineUsersList from "../OnlineUsersList"
import s from "./styles.module.css"

const ChatComponent = () => {
  return (
    <ChatContext>
      <div className={s.chatComponentWrapper}>
        <ChatBox />
        <OnlineUsersList />
      </div>
    </ChatContext>
  )
}

export default ChatComponent
