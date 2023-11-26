export interface User {
  id: string
  username: string
  email: string
  password: string
  profileImage: string
  createdAt: Date
  updatedAt: Date
}

export interface UserFriend {
  id: string
  username: string
  profileImage: string
  addedAt: Date
  fkUser: string
}

export interface ErrorHandling {
  status: number
  error: string
}

export interface Connection {
  id: string
  connectionOne: string
  connectionTwo: string
  createdAt: Date
  updatedAt: Date
  fkUser: string
  messages?: Message[]
}

export interface Message {
  messageId: string
  message: string
  sendToId: string
  sendToUsername: string
  time: Date
  type: string
  userId: string
  userProfilePic: string
  username: string
  createdAt: Date
  fkConnections: string
}

interface UserMessages {
  connections: string[]
  data: Message[]
}
