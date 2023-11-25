import { useContext } from "react"
import { ChatContextProvider } from "../../../context/chatContext"
import { PrivateMessageSchema } from "../../../@types/types"
import Card from "./Card"

interface PrivateMessageProps {
  connection: PrivateMessageSchema
  id: number
}

const PrivateMessageAsideCard = ({ connection, id }: PrivateMessageProps) => {
  const { myId } = useContext(ChatContextProvider)

  return connection.data.map((msg, index) => {
    const userSendingMessage =
      msg.sendToId === myId?.id ? msg.username : msg.sendToUsername

    return (
      index === connection.data.length - 1 && (
        <Card
          key={msg.messageId}
          componentId={id}
          connection={connection}
          msg={msg}
          userSendingMessage={userSendingMessage}
        />
      )
    )
  })
}

export default PrivateMessageAsideCard
