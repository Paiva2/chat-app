import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useLayoutEffect,
  useEffect,
} from "react"
import {
  MyIdSchema,
  PrivateMessageSchema,
  UserOnListSchema,
  WebSocketPayload,
} from "../@types/types"
import ws from "../lib/socket.config"
import Cookies from "js-cookie"
import { getUserProfile } from "../utils/getUserProfile"

interface ChatContextProviderProps {
  children: React.ReactNode
}

interface ChatContextInterface {
  messages: WebSocketPayload[]
  setMessages: Dispatch<SetStateAction<WebSocketPayload[]>>

  myId: MyIdSchema | null
  setMyId: Dispatch<SetStateAction<MyIdSchema | null>>

  usersList: UserOnListSchema[]
  setUsersList: Dispatch<SetStateAction<UserOnListSchema[]>>

  ws: WebSocket

  openedProfile: string
  setOpenedProfile: Dispatch<SetStateAction<string>>

  activeMenu: string
  setActiveMenu: Dispatch<SetStateAction<string>>

  whoIsReceivingPrivate: {
    to: { id: string; username: string; profilePicture: string }
  }
  setWhoIsReceivingPrivate: Dispatch<
    SetStateAction<{ to: { id: string; username: string; profilePicture: string } }>
  >

  privateMessagesList: PrivateMessageSchema[]

  privateMessages: WebSocketPayload[]
  setPrivateMessages: Dispatch<SetStateAction<WebSocketPayload[]>>
}

export const ChatContextProvider = createContext<ChatContextInterface>(
  {} as ChatContextInterface
)

const ChatContext = ({ children }: ChatContextProviderProps) => {
  const [myId, setMyId] = useState<MyIdSchema | null>(null)

  const [messages, setMessages] = useState<WebSocketPayload[]>([])
  const [privateMessages, setPrivateMessages] = useState<WebSocketPayload[]>([])

  const [openedProfile, setOpenedProfile] = useState("")
  const [activeMenu, setActiveMenu] = useState("Home")

  const [usersList, setUsersList] = useState<UserOnListSchema[]>([])
  const [privateMessagesList, setPrivateMessagesList] = useState<
    PrivateMessageSchema[]
  >([])

  const [whoIsReceivingPrivate, setWhoIsReceivingPrivate] = useState({
    to: {
      id: "",
      username: "",
      profilePicture: "",
    },
  })

  function handleWithPrivateMessagesDisplaying(dataParsed: WebSocketPayload) {
    if (whoIsReceivingPrivate.to.id) {
      const checkIfUserHasConversationsPreviously = privateMessagesList.filter(
        (message) => {
          return (
            message.connections.includes(whoIsReceivingPrivate.to.id) &&
            message.connections.includes(myId?.id as string)
          )
        }
      )

      if (checkIfUserHasConversationsPreviously.length > 0) {
        setPrivateMessages(checkIfUserHasConversationsPreviously[0].data)
      } else {
        setPrivateMessages(Array(dataParsed))
      }
    }
  }

  function handleWithOpenConnectionWs() {
    ws.onopen = async () => {
      const authToken = Cookies.get("chatapp-token")

      let determineUser: { id: string; username: string } | null = null

      if (!authToken) {
        determineUser = null
      } else {
        const userData = await getUserProfile(authToken)

        determineUser = {
          id: userData.id,
          username: userData.username,
        }
      }

      ws.send(
        JSON.stringify({
          action: "personal-user-id",
          data: determineUser,
        })
      )
    }
  }

  function handleEventMessagesWs() {
    ws.onmessage = ({ data }) => {
      const parseData = JSON.parse(data)

      const dataParsed: WebSocketPayload = parseData.data

      switch (parseData.action) {
        case "stored_global_msgs": {
          setMessages(parseData.data)

          break
        }

        case "global-message": {
          setMessages((oldValue) => [...oldValue, dataParsed])

          break
        }

        case "private-message": {
          const copyPrivateMsgList = [...privateMessagesList]

          const findSimilarConnections = copyPrivateMsgList.find((msg) => {
            return (
              msg.connections.includes(dataParsed.sendToId as string) &&
              msg.connections.includes(dataParsed.userId)
            )
          })

          if (findSimilarConnections) {
            findSimilarConnections.data.push(parseData.data)
            findSimilarConnections.updatedAt = parseData.data.time
          } else {
            copyPrivateMsgList.push({
              updatedAt: parseData.data.time,
              connections: [parseData.data.sendToId, parseData.data.userId],
              data: [parseData.data],
            })
          }

          const sortByDate = copyPrivateMsgList.sort((a, b) => {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          })

          setPrivateMessagesList(sortByDate)

          handleWithPrivateMessagesDisplaying(dataParsed)

          console.log(copyPrivateMsgList)

          break
        }

        case "my-personal-id": {
          if (!myId) {
            setMyId(parseData.data)
          }

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

  useEffect(() => {
    handleEventMessagesWs()
  }, [ws, privateMessagesList, privateMessages, whoIsReceivingPrivate])

  useLayoutEffect(() => {
    handleWithOpenConnectionWs()

    return () => ws.close()
  }, [])

  return (
    <ChatContextProvider.Provider
      value={{
        messages,
        myId,
        usersList,
        ws,
        openedProfile,
        activeMenu,
        privateMessages,
        privateMessagesList,
        whoIsReceivingPrivate,
        setPrivateMessages,
        setWhoIsReceivingPrivate,
        setActiveMenu,
        setOpenedProfile,
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
