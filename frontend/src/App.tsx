import ChatComponent from "./components/ChatComponent"
import ControlBar from "./components/ControlBar"
import ChatContext from "./context/chatContext"

function App() {
  return (
    <ChatContext>
      <main className="main-app">
        <ChatComponent />
        <ControlBar />
      </main>
    </ChatContext>
  )
}

export default App
