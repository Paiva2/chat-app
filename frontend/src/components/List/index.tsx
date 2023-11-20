import { Fragment, useContext } from "react"
import s from "./styles.module.css"
import { ChatContextProvider } from "../../context/chatContext"
import UserOnList from "./UserOnList"
import PrivateMessageAsideCard from "./PrivateMessageAsideCard"
import EmptyListPlaceholder from "../EmptyListPlaceholder"
import UserFriend from "./UserFriend"
import { UserContextProvider } from "../../context/userContext"

const List = () => {
  const { usersList, myId, activeMenu, privateMessagesList } =
    useContext(ChatContextProvider)

  const { userFriendList } = useContext(UserContextProvider)

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
      {activeMenu === "Home" && (
        <Fragment>
          <h1 className={s.onlineText}>Online Users</h1>
          <ul>
            {usersList?.map((user) => {
              return <UserOnList key={user.id} user={user} />
            })}
          </ul>
        </Fragment>
      )}

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
              <EmptyListPlaceholder iconNumber={0} text="No Messages to show..." />
            )}
          </ul>
        </Fragment>
      )}

      {activeMenu === "Friend List" && (
        <Fragment>
          <h1 className={s.friendListTitle}>Friend List</h1>
          <ul>
            {userFriendList.length > 0 ? (
              userFriendList.map((friend) => {
                return <UserFriend friend={friend} key={friend.id} />
              })
            ) : (
              <EmptyListPlaceholder iconNumber={1} text="No friends were found..." />
            )}
          </ul>
        </Fragment>
      )}
    </div>
  )
}

export default List
