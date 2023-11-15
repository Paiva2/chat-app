export interface WebSocketPayload {
  type: string
  userId: string
  username: string
  message: string
  time: Date
  messageId: string
  sendToId: string
}

export interface PrivateMessageSchema {
  connections: string[]

  data: {
    type: string
    userId: string
    messageId: string
    username: string
    sendToId: string
    sendToUsername: string
    message: string
    time: Date
  }[]
}
