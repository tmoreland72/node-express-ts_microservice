import { hash } from 'bcrypt'
import { CreateUserDto } from '@dtos/users.dto'
import { HttpException } from '@exceptions/http.exception'
import { IUser } from '@interfaces/users.interface'
import userModel from '@models/users.model'

class UserService {
   public users = userModel

   public async findAllUser(): Promise<IUser[]> {
      const users: IUser[] = this.users
      return users
   }

   public async findUserById(userId: number): Promise<IUser> {
      const findUser: IUser = this.users.find((user) => user.id === userId)
      if (!findUser) throw new HttpException(409, "User doesn't exist")

      return findUser
   }

   public async createUser(userData: CreateUserDto): Promise<IUser> {
      const findUser: IUser = this.users.find(
         (user) => user.email === userData.email
      )
      if (findUser)
         throw new HttpException(
            409,
            `This email ${userData.email} already exists`
         )

      const hashedPassword = await hash(userData.password, 10)
      const createUserData: IUser = {
         id: this.users.length + 1,
         ...userData,
         password: hashedPassword,
      }
      this.users = [...this.users, createUserData]

      return createUserData
   }

   public async updateUser(
      userId: number,
      userData: CreateUserDto
   ): Promise<IUser[]> {
      const findUser: IUser = this.users.find((user) => user.id === userId)
      if (!findUser) throw new HttpException(409, "IUser doesn't exist")

      const hashedPassword = await hash(userData.password, 10)
      const updateUserData: IUser[] = this.users.map((user: IUser) => {
         if (user.id === findUser.id)
            user = { id: userId, ...userData, password: hashedPassword }
         return user
      })

      return updateUserData
   }

   public async deleteUser(userId: number): Promise<IUser[]> {
      const findUser: IUser = this.users.find((user) => user.id === userId)
      if (!findUser) throw new HttpException(409, "IUser doesn't exist")

      const deleteUserData: IUser[] = this.users.filter(
         (user) => user.id !== findUser.id
      )
      return deleteUserData
   }
}

export default UserService
