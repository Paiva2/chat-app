import { UserFriend } from "../@types/types"
import { UserFriendEntity } from "../database/entities/UserFriend.entity"

export interface UserFriendInterface {
  create(
    username: string,
    profileImage: string,
    fkUser: string,
    auth: boolean,
    id?: string
  ): Promise<UserFriend>

  findFriendListUser(
    friendId: string,
    fkUser: string
  ): Promise<UserFriend | UserFriendEntity | null>

  findAllUserFriends(fkUser: string): Promise<UserFriend[]>

  removeById(friendOwnerId: string, friendId: string): Promise<UserFriend[]>
}
