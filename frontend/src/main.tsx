import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./global.css"
import ChatContext from "./context/chatContext.tsx"
import UserContext from "./context/userContext.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UserContext>
    <ChatContext>
      <App />
    </ChatContext>
  </UserContext>
)
