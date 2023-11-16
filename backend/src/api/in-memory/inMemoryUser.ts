import UserInterface from "../interfaces/userInterface"
import { randomUUID } from "node:crypto"
import { User } from "../@types/types"

export default class InMemoryUser implements UserInterface {
  private users: User[] = []

  async create(username: string, email: string, password: string): Promise<User> {
    const newUser = {
      id: randomUUID(),
      username,
      email,
      password,
      profileImage: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.users.push(newUser)

    return newUser
  }

  async findByEmail(email: string): Promise<User | null> {
    const findUser = this.users.find((user) => user.email === email)

    if (!findUser) return null

    return findUser
  }

  async updatePassword(userId: string, newPassword: string): Promise<User> {
    const findUser = this.users.find(({ id }) => id === userId)!

    findUser.password = newPassword
    findUser.updatedAt = new Date()

    return findUser
  }
}
