import ChatComponent from "./components/ChatComponent"
import ControlBar from "./components/ControlBar"
import ForgotPasswordModal from "./components/ForgotPasswordModal"
import LoginModal from "./components/LoginModal"
import RegisterModal from "./components/RegisterModal"

function App() {
  return (
    <main className="main-app">
      <ChatComponent />
      <ControlBar />
      <LoginModal />
      <RegisterModal />
      <ForgotPasswordModal />
    </main>
  )
}

export default App
