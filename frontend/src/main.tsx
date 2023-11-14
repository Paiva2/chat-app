import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./global.css"
import ChatContext from "./context/chatContext.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ChatContext>
    <App />
  </ChatContext>
)
