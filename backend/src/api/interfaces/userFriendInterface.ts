import { UserFriend } from "../@types/types"

export interface UserFriendInterface {
  create(
    username: string,
    profileImage: string,
    fkUser: string,
    id?: string
  ): Promise<UserFriend>

  findFriendListUser(friendId: string, fkUser: string): Promise<UserFriend | null>
}
