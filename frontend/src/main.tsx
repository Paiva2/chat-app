import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./global.css"
import ChatContext from "./context/chatContext.tsx"
import UserContext from "./context/userContext.tsx"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./lib/queryClient.ts"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <UserContext>
      <ChatContext>
        <App />
      </ChatContext>
    </UserContext>
  </QueryClientProvider>
)
