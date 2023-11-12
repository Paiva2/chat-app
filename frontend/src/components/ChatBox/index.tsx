import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import style from "./styles.module.css"

const ChatBox = () => {
  const [messages, setMessages] = useState<string[]>([])
  const newMessageInputRef = useRef<HTMLInputElement | null>(null)
  const [usersList, setUsersList] = useState<string[]>([])

  const ws: WebSocket = useMemo(() => {
    return new WebSocket("ws://localhost:6969")
  }, [])

  useEffect(() => {
    if ("WebSocket" in window) {
      ws.onmessage = ({ data }) => {
        const parseData = JSON.parse(data)

        if (parseData.action === "global-message") {
          setMessages((oldValue) => [...oldValue, parseData.data])
        }

        if (parseData.action === "get-connected-users") {
          setUsersList(parseData.data)
        }
      }
    }
  }, [ws])

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

  return (
    <main className={style.chatContainer}>
      <form onSubmit={handleSendMessage}>
        <div>
          <ul>
            {messages.map((msg, idx) => {
              return <li key={idx}>{msg}</li>
            })}
          </ul>
        </div>
        <input ref={newMessageInputRef} type="text" />
        <button type="submit">Send</button>
      </form>

      <aside className={style.usersAside}>
        <ul>
          {usersList.map((user, idx) => {
            return <li key={idx}>{user}</li>
          })}
        </ul>
      </aside>
    </main>
  )
}

export default ChatBox
