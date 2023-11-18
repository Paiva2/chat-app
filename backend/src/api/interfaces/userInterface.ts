import { User } from "../@types/types"

export default interface UserInterface {
  create(username: string, email: string, password: string): Promise<User>
  findByEmail(email: string): Promise<User | null>
  findById(userId: string): Promise<User | null>
  updatePassword(userId: string, newPassword: string): Promise<User | null>
}
