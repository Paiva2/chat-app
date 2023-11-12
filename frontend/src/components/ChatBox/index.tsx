import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import s from "./styles.module.css"
import { SendHorizontal } from "lucide-react"

interface WebSocketPayload {
  type: string
  userId: string
  message: string
  time: Date
}

const ChatBox = () => {
  const [messages, setMessages] = useState<WebSocketPayload[]>([])
  const [usersList, setUsersList] = useState<string[]>([])
  const [myId, setMyId] = useState<string | null>(null)

  const newMessageInputRef = useRef<HTMLInputElement | null>(null)
  const messagesListRef = useRef<HTMLUListElement | null>(null)

  const ws: WebSocket = useMemo(() => {
    return new WebSocket("ws://localhost:6969")
  }, [])

  useEffect(() => {
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

    ws.onmessage = ({ data }) => {
      const parseData = JSON.parse(data)

      const dataParsed: WebSocketPayload = parseData.data

      if (parseData.action === "global-message") {
        setMessages((oldValue) => [...oldValue, dataParsed])
      }

      if (parseData.action === "get-connected-users") {
        //setUsersList(parseData.data)
      }

      if (parseData.action === "my-personal-id") {
        //localStorage.setItem("temp-chat-id", parseData.data)
        setMyId(parseData.data)
      }
    }
  }, [ws, myId])

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

  const displayTimeOptions: Intl.DateTimeFormatOptions = {
    hour12: true,
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
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
