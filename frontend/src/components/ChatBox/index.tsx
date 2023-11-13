import { FormEvent, useEffect, useRef, useContext } from "react"
import s from "./styles.module.css"
import { SendHorizontal } from "lucide-react"
import { ChatContextProvider } from "../../context/chatContext"
import ws from "../../lib/socket.config"

const ChatBox = () => {
  const newMessageInputRef = useRef<HTMLInputElement | null>(null)
  const messagesListRef = useRef<HTMLUListElement | null>(null)

  const { messages, myId } = useContext(ChatContextProvider)

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
  }, [messages])

  function handleSendMessage(e: FormEvent) {
    e.preventDefault()

    if (!newMessageInputRef?.current?.value) return

    if (ws.readyState === 1) {
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
  }

  return (
    <main className={s.chatContainer}>
      <form onSubmit={handleSendMessage} className={s.chatWrapper}>
        <ul ref={messagesListRef} className={`${s.messagesWrapper} messagesWrapper`}>
          {messages.map(({ message, time, type, userId }, idx) => {
            return (
              <li
                key={idx}
                className={`${s.messageInfos} ${userId === myId ? s.sentByMe : ""}`}
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
