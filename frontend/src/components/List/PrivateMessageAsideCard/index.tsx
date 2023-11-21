import { Fragment, useContext } from "react"
import { ChatContextProvider } from "../../../context/chatContext"
import { FetchUserSchema, PrivateMessageSchema } from "../../../@types/types"
import { displayTimeOptions } from "../../../utils/displayTimeOptions"
import { useQuery } from "@tanstack/react-query"
import api from "../../../lib/api"
import s from "./styles.module.css"

interface PrivateMessageProps {
  connection: PrivateMessageSchema
}

const PrivateMessageAsideCard = ({ connection }: PrivateMessageProps) => {
  const {
    myId,
    privateMessagesList,
    whoIsReceivingPrivate,
    setPrivateMessages,
    setWhoIsReceivingPrivate,
  } = useContext(ChatContextProvider)

  const getOthersideUserId = connection.connections.find(
    (conn) => !conn?.includes(myId?.id as string)
  )

  const { data: userData } = useQuery({
    queryKey: ["getOthersideUserId"],
    queryFn: async () => {
      const { data } = await api.get(`/user/${getOthersideUserId}`)

      return data as FetchUserSchema | null
    },
    enabled: Boolean(getOthersideUserId),
    retry: false,
    refetchOnMount: true,
  })

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
        profilePicture: userData?.profileImage ?? "https://i.imgur.com/jOkraDo.png",
      },
    })
  }

  console.log(userData)

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
                  <img
                    src={userData?.profileImage ?? "https://i.imgur.com/jOkraDo.png"}
                    className={s.userImage}
                  />
                  <span className={s.userInfos}>
                    <p>{userSendingMessage}</p>

                    <p className={s.messageResume}>
                      {msg.userId === myId?.id ? `Me: ${msg.message}` : msg.message}
                    </p>
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
