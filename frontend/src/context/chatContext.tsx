import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useLayoutEffect,
} from "react"
import ws from "../lib/socket.config"
import { WebSocketPayload } from "../@types/types"

interface ChatContextProviderProps {
  children: React.ReactNode
}

interface ChatContextInterface {
  messages: WebSocketPayload[]
  setMessages: Dispatch<SetStateAction<WebSocketPayload[]>>

  myId: { id: string; username: string } | null
  setMyId: Dispatch<SetStateAction<{ id: string; username: string } | null>>

  usersList: { id: string; username: string }[]
  setUsersList: Dispatch<SetStateAction<{ id: string; username: string }[]>>

  ws: WebSocket

  openedProfiles: string
  setOpenedProfiles: Dispatch<SetStateAction<string>>

  activeMenu: string
  setActiveMenu: Dispatch<SetStateAction<string>>
}

export const ChatContextProvider = createContext<ChatContextInterface>(
  {} as ChatContextInterface
)

const ChatContext = ({ children }: ChatContextProviderProps) => {
  const [myId, setMyId] = useState<{ id: string; username: string } | null>(null)

  const [messages, setMessages] = useState<WebSocketPayload[]>([])
  const [privateMessages, setPrivateMessages] = useState<WebSocketPayload[]>([])

  const [openedProfiles, setOpenedProfiles] = useState("")
  const [activeMenu, setActiveMenu] = useState("Home")

  const [usersList, setUsersList] = useState<{ id: string; username: string }[]>([])
  const [privateMessagesList, setPrivateMessagesList] = useState([])

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

  useLayoutEffect(() => {
    handleEventMessagesWs()
  }, [ws])

  useLayoutEffect(() => {
    handleWithOpenConnectionWs()

    return () => ws.close()
  }, [ws])

  return (
    <ChatContextProvider.Provider
      value={{
        messages,
        myId,
        usersList,
        ws,
        openedProfiles,
        activeMenu,
        privateMessages,
        privateMessagesList,
        setActiveMenu,
        setOpenedProfiles,
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
