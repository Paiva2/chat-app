export interface User {
  id: string
  username: string
  email: string
  password: string
  profileImage: string
  createdAt: Date
  updatedAt: Date
}

export interface ErrorHandling {
  status: number
  error: string
}
