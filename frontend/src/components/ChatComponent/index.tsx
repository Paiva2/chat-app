import ChatBox from "../ChatBox"
import List from "../List"
import s from "./styles.module.css"

const ChatComponent = () => {
  return (
    <div className={s.chatComponentWrapper}>
      <ChatBox />
      <List />
    </div>
  )
}

export default ChatComponent
