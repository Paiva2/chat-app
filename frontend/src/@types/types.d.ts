export interface WebSocketPayload {
  type: string
  userId: string
  username: string
  message: string
  time: Date
  messageId: string
  sendToId: string
  userProfilePic: string
}

export interface PrivateMessageSchema {
  connections: string[]
  updatedAt: Date

  data: {
    type: string
    userId: string
    messageId: string
    username: string
    sendToId: string
    sendToUsername: string
    message: string
    time: Date
    userProfilePic: string
  }[]
}

export interface UserProfileSchema {
  createdAt: string
  email: string
  id: string
  profileImage: string
  updatedAt: string
  username: string
}
