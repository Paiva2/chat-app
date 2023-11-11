import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import style from "./styles.module.css"

function App() {
  const [messages, setMessages] = useState<string[]>([])
  const newMessageInputRef = useRef<HTMLInputElement | null>(null)

  const ws: WebSocket = useMemo(() => {
    return new WebSocket("ws://localhost:6969")
  }, [])

  useEffect(() => {
    if ("WebSocket" in window) {
      ws.onmessage = ({ data }) => {
        setMessages((oldValue) => [...oldValue, String(data)])
      }
    }
  }, [ws])

  function handleSendMessage(e: FormEvent) {
    e.preventDefault()

    if (ws.readyState === 1) {
      if (newMessageInputRef?.current) {
        ws.send(newMessageInputRef.current.value)

        newMessageInputRef.current.value = ""
        newMessageInputRef.current.focus()
      }
    }
  }

  return (
    <>
      <form onSubmit={handleSendMessage}>
        <h1 className={style.test}>Teste</h1>
        <div>
          <h1>Messages</h1>

          <ul>
            {messages.map((msg, idx) => {
              return <li key={idx}>{msg}</li>
            })}
          </ul>
        </div>
        <input ref={newMessageInputRef} type="text" />
        <button type="submit">Send</button>
      </form>
    </>
  )
}

export default App
