import { TypeOrm } from "../../data-source"
import { User } from "../@types/types"
import UserInterface from "../interfaces/userInterface"
import { User as UserEntity } from "../database/entities/User.entity"

export default class UserModel implements UserInterface {
  private user = new UserEntity()
  private userRepository = TypeOrm.getRepository(UserEntity)

  async create(username: string, email: string, password: string): Promise<User> {
    this.user.username = username
    this.user.email = email
    this.user.password = password
    this.user.profileImage = "https://i.imgur.com/jOkraDo.png"

    await this.userRepository.save(this.user)

    return this.user
  }

  async findByEmail(email: string): Promise<User | null> {
    const getUser = await this.userRepository.findOneBy({
      email,
    })

    return getUser
  }

  async updatePassword(userId: string, newPassword: string): Promise<User | null> {
    const getUser = await this.userRepository.findOneBy({
      id: userId,
    })

    if (!getUser) return null

    getUser.password = newPassword
    getUser.updatedAt = new Date()

    await this.userRepository.save(getUser)

    return getUser
  }

  async findById(userId: string): Promise<User | null> {
    const getUser = await this.userRepository.findOneBy({
      id: userId,
    })

    return getUser
  }
}
