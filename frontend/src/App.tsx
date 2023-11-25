import { useContext } from "react"
import { ChatContextProvider } from "./context/chatContext"
import ChatComponent from "./components/ChatComponent"
import ControlBar from "./components/ControlBar"
import ForgotPasswordModal from "./components/ForgotPasswordModal"
import LoginModal from "./components/LoginModal"
import RegisterModal from "./components/RegisterModal"
import MultipleConnectionError from "./components/MultipleConnectionError"

function App() {
  const { multipleConnectionDetected } = useContext(ChatContextProvider)

  return (
    <main className="main-app">
      <ChatComponent />
      <ControlBar />
      <LoginModal />
      <RegisterModal />
      <ForgotPasswordModal />
      {multipleConnectionDetected && <MultipleConnectionError />}
    </main>
  )
}

export default App
