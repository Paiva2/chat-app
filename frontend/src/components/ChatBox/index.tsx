import { FormEvent, useRef, useContext, useEffect } from "react"
import { SendHorizontal } from "lucide-react"
import { ChatContextProvider } from "../../context/chatContext"
import { WebSocketPayload } from "../../@types/types"
import { displayTimeOptions } from "../../utils/displayTimeOptions"
import { UserContextProvider } from "../../context/userContext"
import ws from "../../lib/socket.config"
import s from "./styles.module.css"

const ChatBox = () => {
  const {
    messages,
    myId,
    activeMenu,
    whoIsReceivingPrivate,
    privateMessages,
    usersList,
  } = useContext(ChatContextProvider)

  const { userProfile } = useContext(UserContextProvider)

  const newMessageInputRef = useRef<HTMLInputElement | null>(null)
  const messagesListRef = useRef<HTMLUListElement | null>(null)

  let messagesToDisplay: WebSocketPayload[] = messages

  if (activeMenu === "Messages" && whoIsReceivingPrivate.to.id) {
    messagesToDisplay = privateMessages
  } else if (privateMessages.length) {
    messagesToDisplay = privateMessages
  } else if (activeMenu === "Home") {
    messagesToDisplay = messages
  }

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

  function privateMessage() {
    const from = {
      id: myId?.id,
      username: myId?.username,
      profilePic: userProfile?.profileImage ?? null,
    }

    if (newMessageInputRef?.current) {
      ws.send(
        JSON.stringify({
          action: "new-private-message",
          data: {
            from: from,
            destiny: whoIsReceivingPrivate,
            message: newMessageInputRef.current.value,
          },
        })
      )

      newMessageInputRef.current.value = ""
      newMessageInputRef.current.focus()
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
