import { Fragment, useContext } from "react"
import s from "./styles.module.css"
import { ChatContextProvider } from "../../context/chatContext"
import UserOnList from "./UserOnList"
import PrivateMessageAsideCard from "./PrivateMessageAsideCard"
import EmptyListPlaceholder from "../EmptyListPlaceholder"

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
        <Fragment>
          <ul className={s.privateList}>
            {privateMessagesList.length > 0 ? (
              <Fragment>
                <h1 className={s.roomName}>Messages</h1>
                {privateMessagesList?.map((connection, idx) => {
                  return (
                    <PrivateMessageAsideCard key={idx} connection={connection} />
                  )
                })}
              </Fragment>
            ) : (
              <EmptyListPlaceholder />
            )}
          </ul>
        </Fragment>
      )}

      {activeMenu === "Home" && (
        <Fragment>
          <p className={s.onlineText}>Online Users</p>
          <ul>
            {usersList?.map((user) => {
              return <UserOnList key={user.id} user={user} />
            })}
          </ul>
        </Fragment>
      )}

      {activeMenu === "Friend List" && (
        <Fragment>
          <h1>Friend List</h1>
        </Fragment>
      )}
    </div>
  )
}

export default List
