import { UserFriend } from "../@types/types"
import { UserFriendEntity } from "../database/entities/UserFriend.entity"

export interface UserFriendInterface {
  create(
    username: string,
    profileImage: string,
    fkUser: string,
    id?: string
  ): Promise<UserFriend>

  findFriendListUser(
    friendId: string,
    fkUser: string
  ): Promise<UserFriend | UserFriendEntity | null>
}
