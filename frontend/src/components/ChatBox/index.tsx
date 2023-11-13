import { FormEvent, useEffect, useRef, useContext } from "react"
import s from "./styles.module.css"
import { SendHorizontal } from "lucide-react"
import { ChatContextProvider } from "../../context/chatContext"
import ws from "../../lib/socket.config"
import { WebSocketPayload } from "../../@types/types"

const ChatBox = () => {
  const { messages, myId, activeMenu, privateMessages } =
    useContext(ChatContextProvider)

  const newMessageInputRef = useRef<HTMLInputElement | null>(null)
  const messagesListRef = useRef<HTMLUListElement | null>(null)

  let messagesToDisplay: WebSocketPayload[] = []

  if (activeMenu === "Home") {
    messagesToDisplay = messages
  } else if (activeMenu === "Messages") {
    messagesToDisplay = privateMessages
  }

  const displayTimeOptions: Intl.DateTimeFormatOptions = {
    hour12: true,
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }

  useEffect(() => {
    if (messagesListRef.current) {
      messagesListRef.current.scrollTo({
        behavior: "auto",
        top: messagesListRef.current.scrollHeight,
      })
    }
  }, [messagesToDisplay])

  function globalMessage() {
    if (newMessageInputRef?.current) {
      ws.send(
        JSON.stringify({
          action: "new-message",
          data: newMessageInputRef.current.value,
        })
      )

      newMessageInputRef.current.value = ""
      newMessageInputRef.current.focus()
    }
  }

  function privateMessage() {
    if (newMessageInputRef?.current) {
      ws.send(
        JSON.stringify({
          action: "new-private-message",
          data: {
            to: "",
            data: newMessageInputRef.current.value,
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
      } else if (activeMenu === "Message") {
        privateMessage()
      }
    }
  }

  return (
    <main className={s.chatContainer}>
      <form onSubmit={handleSendMessage} className={s.chatWrapper}>
        <ul ref={messagesListRef} className={`${s.messagesWrapper} messagesWrapper`}>
          {messagesToDisplay.map(({ message, time, type, userId }, idx) => {
            return (
              <li
                key={idx}
                className={`${s.messageInfos} ${
                  userId === myId.username ? s.sentByMe : ""
                }`}
              >
                <span className={s.message}>
                  {type === "message" && (
                    <span className={s.messageSender}>
                      <div className={s.avatar} />
                      <span className={s.sentBy}>
                        <p className={s.personName}>{userId}</p>
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
          })}
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
