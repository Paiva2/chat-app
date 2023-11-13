import { useContext } from "react"
import s from "./styles.module.css"
import { ChatContextProvider } from "../../context/chatContext"
import UserOnList from "./UserOnList"

const List = () => {
  const { usersList, myId, activeMenu, privateMessagesList } =
    useContext(ChatContextProvider)

  if (myId) {
    const getMyUser = usersList.find((user) => user.id === myId?.id)

    if (getMyUser) {
      const myIdIndex = usersList?.indexOf(getMyUser)

      usersList?.splice(myIdIndex, 1)

      usersList?.unshift(myId)
    }
  }

  return (
    <div className={s.listContainer}>
      {activeMenu === "Messages" && (
        <>
          <h1 className={s.roomName}>Messages</h1>
          <ul>
            {/* {privateMessagesList.map((message) => {
              return <li key={message}>{message}</li>
            })} */}
          </ul>
        </>
      )}

      {activeMenu === "Home" && (
        <>
          <h1 className={s.roomName}>Public Messages</h1>
          <p className={s.onlineText}>Online</p>
          <ul>
            {usersList?.map((user) => {
              return <UserOnList key={user.id} user={user} />
            })}
          </ul>
        </>
      )}
    </div>
  )
}

export default List
