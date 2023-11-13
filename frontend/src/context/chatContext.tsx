import React, {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react"
import ws from "../lib/socket.config"
import { WebSocketPayload } from "../@types/types"

interface ChatContextProviderProps {
  children: React.ReactNode
}

interface ChatContextInterface {
  messages: WebSocketPayload[]
  setMessages: Dispatch<SetStateAction<WebSocketPayload[]>>

  myId: string | null
  setMyId: Dispatch<SetStateAction<string | null>>

  usersList: string[]
  setUsersList: Dispatch<SetStateAction<string[]>>

  ws: WebSocket
}

export const ChatContextProvider = createContext<ChatContextInterface>(
  {} as ChatContextInterface
)

const ChatContext = ({ children }: ChatContextProviderProps) => {
  const [messages, setMessages] = useState<WebSocketPayload[]>([])
  const [myId, setMyId] = useState<string | null>(null)
  const [usersList, setUsersList] = useState<string[]>([])

  function handleEventMessagesWs() {
    ws.onmessage = ({ data }) => {
      const parseData = JSON.parse(data)

      const dataParsed: WebSocketPayload = parseData.data

      switch (parseData.action) {
        case "global-message": {
          setMessages((oldValue) => [...oldValue, dataParsed])
          break
        }

        case "my-personal-id": {
          //localStorage.setItem("temp-chat-id", parseData.data)
          setMyId(parseData.data)
          break
        }

        case "get-connected-users": {
          setUsersList(parseData.data)
          break
        }

        default:
          null
      }
    }
  }

  function handleWithOpenConnectionWs() {
    ws.onopen = () => {
      let determineId: string | null = ""
      const getId = null //localStorage.getItem("temp-chat-id")

      if (!getId) {
        determineId = null
      } else {
        determineId = getId
      }

      ws.send(
        JSON.stringify({
          action: "personal-user-id",
          data: determineId,
        })
      )
    }
  }

  useEffect(() => {
    if (ws) {
      handleWithOpenConnectionWs()

      handleEventMessagesWs()
    }
  }, [ws])

  return (
    <ChatContextProvider.Provider
      value={{
        messages,
        myId,
        usersList,
        ws,
        setMessages,
        setMyId,
        setUsersList,
      }}
    >
      {children}
    </ChatContextProvider.Provider>
  )
}

export default ChatContext
