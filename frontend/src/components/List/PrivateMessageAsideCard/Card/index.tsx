import { useState, useContext, useEffect } from "react"
import { displayTimeOptions } from "../../../../utils/displayTimeOptions"
import { ChatContextProvider } from "../../../../context/chatContext"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { FetchUserSchema, PrivateMessageSchema } from "../../../../@types/types"
import api from "../../../../lib/api"
import s from "./styles.module.css"
import { UserContextProvider } from "../../../../context/userContext"

interface ICardProps {
  connection: PrivateMessageSchema
  userSendingMessage: string
  msg: {
    type: string
    userId: string
    messageId: string
    username: string
    sendToId: string
    sendToUsername: string
    message: string
    time: Date
    userProfilePic: string
  }
  componentId: number
}

const Card = ({ connection, userSendingMessage, msg, componentId }: ICardProps) => {
  const {
    myId,
    privateMessagesList,
    whoIsReceivingPrivate,
    openedMenuFromMessages,
    showListMobile,
    setShowListMobile,
    setOpenenedMenuFromMessages,
    setPrivateMessages,
    setWhoIsReceivingPrivate,
  } = useContext(ChatContextProvider)

  const { userProfile } = useContext(UserContextProvider)

  const [openMiniMenu, setOpenMiniMenu] = useState(false)

  const getOthersideUserId = connection.connections.find(
    (conn) => !conn?.includes(myId?.id as string)
  )

  const queryClient = useQueryClient()

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
        profilePicture:
          userData?.profileImage ?? "https://i.postimg.cc/hjvSCcM3/jOkraDo.png",
      },
    })
  }

  function handleOpenMiniMenu(e: React.MouseEvent) {
    e.preventDefault()

    setOpenMiniMenu(!openMiniMenu)

    setOpenenedMenuFromMessages(componentId)
  }

  useEffect(() => {
    if (openedMenuFromMessages !== componentId) {
      setOpenMiniMenu(false)
    }
  }, [openedMenuFromMessages])

  useEffect(() => {
    setOpenMiniMenu(false)
    setOpenenedMenuFromMessages(null)
  }, [showListMobile])

  const deleteConnection = useMutation({
    mutationKey: ["connectionRemoval"],
    mutationFn: (connectionId: string) => {
      return api.delete("/connection", {
        data: {
          connectionId,
        },
        headers: {
          Authorization: `Bearer ${userProfile?.token}`,
        },
      })
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getStoredMessages"],
      })

      setOpenMiniMenu(false)

      setOpenenedMenuFromMessages(null)

      setPrivateMessages([])

      setWhoIsReceivingPrivate({
        to: {
          id: "",
          username: "",
          profilePicture: "",
        },
      })
    },
  })

  async function handleDeleteConversation(connectionId: string) {
    deleteConnection.mutate(connectionId)
  }

  return (
    <li
      onContextMenu={handleOpenMiniMenu}
      onClick={() => {
        handleSetPrivateMessageToShow(connection.connections, userSendingMessage)
        setShowListMobile(false)
      }}
      className={s.privateCard}
    >
      <button type="button">
        <div className={s.messageInformations}>
          <div className={s.leftSideCard}>
            <img
              src={
                userData?.profileImage ?? "https://i.postimg.cc/hjvSCcM3/jOkraDo.png"
              }
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
            <p>{new Date(msg.time).toLocaleString("en-US", displayTimeOptions)}</p>
          </div>
        </div>
      </button>

      <div className={`${s.miniMenuList} ${openMiniMenu ? s.activeMiniMenu : ""}`}>
        <span>
          <button
            onClick={() => {
              handleSetPrivateMessageToShow(
                connection.connections,
                userSendingMessage
              )
            }}
            type="button"
          >
            Open
          </button>
        </span>
        <span>
          <button
            onClick={() =>
              handleDeleteConversation(connection?.connectionId as string)
            }
            type="button"
          >
            Delete
          </button>
        </span>
      </div>
    </li>
  )
}

export default Card
