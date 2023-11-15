import { Fragment, useContext } from "react"
import { ChatContextProvider } from "../../../context/chatContext"
import { PrivateMessageSchema } from "../../../@types/types"
import s from "./styles.module.css"
import { displayTimeOptions } from "../../../utils/displayTimeOptions"

interface PrivateMessageProps {
  connection: PrivateMessageSchema
}

const PrivateMessageAsideCard = ({ connection }: PrivateMessageProps) => {
  const {
    myId,
    setPrivateMessages,
    setWhoIsReceivingPrivate,
    privateMessagesList,
    whoIsReceivingPrivate,
  } = useContext(ChatContextProvider)

  function handleSetPrivateMessageToShow(
    connectionsId: string[],
    usernameToSend: string
  ) {
    const [sendToId, idFrom] = connectionsId

    const getPreviousConversation = privateMessagesList.filter((message) => {
      return (
        message.connections.includes(sendToId) &&
        message.connections.includes(idFrom)
      )
    })

    const getIdToSend = connectionsId.find((conn) => conn !== myId?.id) as string

    setPrivateMessages(getPreviousConversation[0].data)

    setWhoIsReceivingPrivate({
      ...whoIsReceivingPrivate,
      to: {
        id: getIdToSend,
        username: usernameToSend,
      },
    })
  }

  return connection.data.map((msg, index) => {
    const userSendingMessage =
      msg.sendToId === myId?.id ? msg.username : msg.sendToUsername

    return (
      <Fragment key={msg.messageId}>
        {index === connection.data.length - 1 && (
          <li
            onClick={() =>
              handleSetPrivateMessageToShow(
                connection.connections,
                userSendingMessage
              )
            }
            className={s.privateCard}
          >
            <button type="button">
              <div className={s.messageInformations}>
                <div className={s.leftSideCard}>
                  <div className={s.userImage} />
                  <span className={s.userInfos}>
                    <p>{userSendingMessage}</p>

                    <p className={s.messageResume}>{msg.message}</p>
                  </span>
                </div>

                <div className={s.timeSent}>
                  <p>
                    {new Date(msg.time).toLocaleString("en-US", displayTimeOptions)}
                  </p>
                </div>
              </div>
            </button>
          </li>
        )}
      </Fragment>
    )
  })
}

export default PrivateMessageAsideCard
