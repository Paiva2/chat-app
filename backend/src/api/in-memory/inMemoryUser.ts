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

  async findById(userId: string): Promise<User | null> {
    const findUser = this.users.find((user) => user.id === userId)

    if (!findUser) return null

    return findUser
  }

  async updatePassword(userId: string, newPassword: string): Promise<User | null> {
    const findUser = this.users.find(({ id }) => id === userId)

    if (!findUser) return null

    findUser.password = newPassword
    findUser.updatedAt = new Date()

    return findUser
  }

  async dynamicUpdate(
    userId: string,
    infosToUpdate: {
      username?: string | undefined
      profileImage?: string | undefined
      password?: string | undefined
    }
  ): Promise<User> {
    const getUser = this.users.find((user) => user.id === userId)!

    const fieldsToUpdate = Object.keys(infosToUpdate)

    let updatedUser = {} as typeof getUser

    for (let field of fieldsToUpdate) {
      const fieldToChange = field as keyof typeof infosToUpdate

      updatedUser = {
        ...getUser,
        ...updatedUser,
        [field]: infosToUpdate[fieldToChange],
      }
    }

    this.users.forEach((user) => {
      if (user.id === userId) {
        user = updatedUser
      }
    })

    return updatedUser
  }

  async findByConnection(connections: string[]): Promise<User[] | null> {
    const doesConnectionIncludeAnyAuthUser = this.users.filter((user) =>
      connections.includes(user.id)
    )

    if (!doesConnectionIncludeAnyAuthUser) return null

    return doesConnectionIncludeAnyAuthUser
  }
}
