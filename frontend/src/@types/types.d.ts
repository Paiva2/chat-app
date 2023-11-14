export interface WebSocketPayload {
  type: string
  userId: string
  username: string
  message: string
  time: Date
  sendToId?: string
}
