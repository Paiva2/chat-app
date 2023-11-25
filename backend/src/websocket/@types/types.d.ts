import { WebSocket } from "ws"

export interface GlobalMessagesStored {
  type: string
  messageId: string
  userId: string
  userProfilePic: string
  username: string
  message: string
  time: string
}

export interface CustomWebSocket extends WebSocket {
  id: string
  username: string
  auth: boolean
}

export interface PrivateMessageRequest {
  from: { id: string; username: string; profilePic: string | null }
  destiny: {
    to: {
      id: string
      username: string
      profilePic: string | null
    }
  }
  message: string
}
