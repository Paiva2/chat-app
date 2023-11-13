import { useContext } from "react"
import s from "./styles.module.css"
import { ChatContextProvider } from "../../context/chatContext"

const OnlineUsersList = () => {
  const { usersList } = useContext(ChatContextProvider)

  return (
    <div className={s.listContainer}>
      <h1 className={s.roomName}>Public Room</h1>
      <ul>
        {usersList.map((user) => {
          return <li key={user}>{user}</li>
        })}
      </ul>
    </div>
  )
}

export default OnlineUsersList
