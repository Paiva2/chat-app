import ChatComponent from "./components/ChatComponent"
import ControlBar from "./components/ControlBar"
import LoginModal from "./components/LoginModal"

function App() {
  return (
    <main className="main-app">
      <ChatComponent />
      <ControlBar />
      <LoginModal />
    </main>
  )
}

export default App
