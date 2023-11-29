import { FormEvent, useRef, useContext, useEffect, useState } from "react"
import { SendHorizontal } from "lucide-react"
import { ChatContextProvider } from "../../context/chatContext"
import { INewMessage, WebSocketPayload } from "../../@types/types"
import { displayTimeOptions } from "../../utils/displayTimeOptions"
import { UserContextProvider } from "../../context/userContext"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import ws from "../../lib/socket.config"
import s from "./styles.module.css"
import api from "../../lib/api"

interface INewConnection {
  connections: string[]
  connectionId: string | null
}

const ChatBox = () => {
  const {
    messages,
    myId,
    activeMenu,
    whoIsReceivingPrivate,
    privateMessages,
    privateMessagesList,
    usersList,
  } = useContext(ChatContextProvider)

  const { userProfile } = useContext(UserContextProvider)

  const newMessageInputRef = useRef<HTMLInputElement | null>(null)
  const messagesListRef = useRef<HTMLUListElement | null>(null)

  const [handleWithConnectionAndMessage, setHandleWithConnectionAndMessage] =
    useState(false)

  const queryClient = useQueryClient()

  let messagesToDisplay: WebSocketPayload[] = messages

  if (activeMenu === "Messages" && whoIsReceivingPrivate.to.id) {
    messagesToDisplay = privateMessages
  } else if (privateMessages.length) {
    messagesToDisplay = privateMessages
  } else if (activeMenu === "Home") {
    messagesToDisplay = messages
  }

  const handleConnection = useMutation({
    mutationKey: ["handleConnection"],
    mutationFn: (newConnection: INewConnection) => {
      return api.post("/connection", newConnection, {
        headers: {
          Authorization: `Bearer ${userProfile?.token}`,
        },
      })
    },
  })

  const insertNewPrivateMessage = useMutation({
    mutationKey: ["insertNewPrivateMessage"],
    mutationFn: (newMessage: Pick<INewMessage, "newMessage">) => {
      return api.post("/private-message", newMessage, {
        headers: {
          Authorization: `Bearer ${userProfile?.token}`,
        },
      })
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getStoredMessages"] })
    },
  })

  useEffect(() => {
    if (messagesListRef.current) {
      messagesListRef.current.scrollTo({
        behavior: "auto",
        top: messagesListRef.current.scrollHeight,
      })
    }
  }, [messagesToDisplay, privateMessages.length])

  function globalMessage() {
    if (newMessageInputRef?.current) {
      ws.send(
        JSON.stringify({
          action: "new-message",
          user: {
            id: myId?.id,
            username: myId?.username,
            profilePic: userProfile?.profileImage ?? null,
          },
          data: newMessageInputRef.current.value,
        })
      )

      newMessageInputRef.current.value = ""
      newMessageInputRef.current.focus()
    }
  }

  useEffect(() => {
    if (privateMessagesList.length > 0 && handleWithConnectionAndMessage) {
      handleSendNewMessageAndConnection()
    }
  }, [privateMessagesList])

  async function handleSendNewMessageAndConnection() {
    if (myId && newMessageInputRef.current) {
      const getRecentlyCreatedConnId = privateMessagesList.find((conn) => {
        return (
          conn.connections.includes(whoIsReceivingPrivate.to.id) &&
          conn.connections.includes(myId?.id)
        )
      })

      const handlingConnection = await handleConnection.mutateAsync({
        connectionId: getRecentlyCreatedConnId?.connectionId || null,
        connections: [whoIsReceivingPrivate.to.id, myId?.id],
      })

      const messageValue = newMessageInputRef.current.value

      if (handlingConnection.status === 201) {
        setTimeout(() => {
          insertNewPrivateMessage.mutate({
            newMessage: {
              sendToId: whoIsReceivingPrivate.to.id,
              sendToUsername: whoIsReceivingPrivate.to.username,
              username: myId?.username,
              userId: myId?.id,
              userProfilePic: userProfile?.profileImage as string,
              time: new Date(),
              message: messageValue,
            },
          })
        }, 600)
      }

      newMessageInputRef.current.value = ""
      newMessageInputRef?.current?.focus()
    }

    setHandleWithConnectionAndMessage(false)
  }

  function privateMessage() {
    const from = {
      id: myId?.id,
      username: myId?.username,
      profilePic: userProfile?.profileImage ?? null,
    }

    if (newMessageInputRef?.current) {
      const checkIfConnectionForThisMessageExistsAlready = privateMessagesList.find(
        (conn) => {
          return (
            conn.connections.includes(whoIsReceivingPrivate.to.id) &&
            conn.connections.includes(from.id as string)
          )
        }
      )

      ws.send(
        JSON.stringify({
          action: "new-private-message",
          data: {
            fromConnectionId:
              checkIfConnectionForThisMessageExistsAlready?.connectionId,
            from: from,
            destiny: whoIsReceivingPrivate,
            message: newMessageInputRef.current.value,
          },
        })
      )

      setHandleWithConnectionAndMessage(true)
    }
  }

  function handleSendMessage(e: FormEvent) {
    e.preventDefault()

    if (!newMessageInputRef?.current?.value) return

    if (ws.readyState === 1) {
      if (activeMenu === "Home") {
        globalMessage()
      } else if (whoIsReceivingPrivate.to.id) {
        privateMessage()
      }
    }
  }

  const isUserOnline = usersList.some(
    (user) => user.id === whoIsReceivingPrivate?.to?.id
  )

  return (
    <main className={s.chatContainer}>
      <form onSubmit={handleSendMessage} className={s.chatWrapper}>
        {whoIsReceivingPrivate.to.id && (
          <div className={s.userNameHeader}>
            <span className={s.headerMessageSender}>
              <img
                alt="Profile Picture"
                src={whoIsReceivingPrivate.to.profilePicture}
                className={s.headerAvatar}
              />
            </span>
            <div className={s.user}>
              <h1>{whoIsReceivingPrivate.to.username}</h1>

              <div className={s.userConnection}>
                <span className={`${isUserOnline ? s.on : s.off}`} />
                {isUserOnline ? "Online" : "Offline"}
              </div>
            </div>
          </div>
        )}

        <ul ref={messagesListRef} className={`${s.messagesWrapper} messagesWrapper`}>
          {messagesToDisplay.map(
            ({
              message,
              time,
              type,
              userId,
              username,
              messageId,
              userProfilePic,
            }) => {
              const messageTypesAllowedToImg =
                type === "message" || type === "private-message"

              return (
                <li
                  key={messageId}
                  className={`${s.messageInfos} ${
                    userId === myId?.id ? s.sentByMe : ""
                  }`}
                >
                  <span className={s.message}>
                    {messageTypesAllowedToImg && (
                      <span className={s.messageSender}>
                        <img
                          alt="Profile Picture"
                          src={userProfilePic}
                          className={s.avatar}
                        />
                        <span className={s.sentBy}>
                          <p className={s.personName}>{username}</p>
                          <span className={s.sentTime}>
                            {new Date(time).toLocaleString(
                              "en-US",
                              displayTimeOptions
                            )}
                          </span>
                        </span>
                      </span>
                    )}

                    <div className={s.messageTextWrapper}>
                      <p>{message}</p>
                    </div>
                  </span>
                </li>
              )
            }
          )}
        </ul>

        <div className={s.sendMessageBox}>
          <span className={s.sendMessageInput}>
            <input ref={newMessageInputRef} placeholder="New message" type="text" />
            <button type="submit">
              <SendHorizontal color="#261F5D" />
            </button>
          </span>
        </div>
      </form>
    </main>
  )
}

export default ChatBox
