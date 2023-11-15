import { User } from "../@types/types"

export default interface UserInterface {
  create(username: string, email: string, password: string): Promise<User>
  findByEmail(email: string): Promise<User | null>
}
