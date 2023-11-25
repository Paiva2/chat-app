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
  token: string
}

export interface MyIdSchema {
  id: string
  username: string
  auth: boolean
}

export interface FetchUserSchema {
  username: string
  email: string
  id: string
  profileImage: string
}

export interface UserOnListSchema {
  id: string
  username: string
  auth: boolean
}

export interface UserFriend {
  id: string
  username: string
  profileImage: string
  addedAt: Date
  fkUser: string
}

export interface INewMessage {
  connections: string[]
  newMessage: {
    sendToId: string
    sendToUsername: string
    username: string
    userId: string
    userProfilePic: string
    time: Date
    message: string
  }
}
