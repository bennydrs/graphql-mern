import { UserInputError } from "apollo-server-core"
import { compare, hash } from "bcryptjs"
import { User } from "../models/User"
import {
  createAccessToken,
  createRefreshToken,
  getUser,
  protect,
  sendRefreshToken,
} from "../utils/auth"
import { registerValidate } from "../validations/registerValidate"
import { v4 as uuidv4 } from "uuid"

const UserResolver = {
  Query: {
    users: async () => await User.find(),
    bye: (_, {}, { user }) => {
      protect(user)
      return `your email is: ${user.email}`
    },
    me: async (_, {}, { req }) => {
      return getUser(req)
    },
  },
  Mutation: {
    register: async (_, { newuser }) => {
      const { name, email, password } = newuser
      const hashedPassword = await hash(password, 12)

      registerValidate(newuser)

      try {
        const user = await User.create({ name, email, password: hashedPassword })
        return {
          email: user.email,
          name: user.name,
        }
      } catch (err) {
        if (err.code === 11000) {
          throw new UserInputError("Email already taken", {
            argumentName: "email",
          })
        }
        console.log("err", err)
      }
    },
    login: async (_, { email, password }, { res }) => {
      // cari email dan update session id
      const user = await User.findOneAndUpdate(
        { email },
        { sessionId: uuidv4() },
        {
          new: true,
        }
      )

      if (!user) {
        throw new Error("could not find user")
      }

      const valid = await compare(password, user.password)

      if (!valid) {
        throw new Error("email or password not match")
      }

      sendRefreshToken(res, createRefreshToken(user))

      return {
        accessToken: createAccessToken(user),
        user,
      }
    },
    logout: async (_, {}, { res, req }) => {
      const { email } = await getUser(req)
      // cari email dan update session id
      await User.findOneAndUpdate({ email }, { sessionId: "" }, { new: true })
      sendRefreshToken(res, "")
      return true
    },
    revokeRefreshTokenForUser: async (_, { userId }) => {
      await User.findOneAndUpdate({ _id: userId }, { $inc: { tokenVersion: 1 } }, { new: true })

      return true
    },
    updateUser: async (_, { userId, name }, { user }) => {
      protect(user)
      try {
        const user = await User.findOneAndUpdate({ _id: userId }, { name }, { new: true }).select(
          "-password"
        )
        return user
      } catch (err) {
        console.log("err", err)
      }
    },
    updatePassword: async (_, { oldPassword, newPassword }, { user: currentUser }) => {
      protect(currentUser)

      const user = await User.findOne({ _id: currentUser._id })

      if (!user) {
        throw new Error("could not find user")
      }

      const isMatch = await compare(oldPassword, user.password)
      if (!isMatch) {
        throw new Error("Old password is wrong!")
      }

      const hashedNewPassword = await hash(newPassword, 12)
      user.password = hashedNewPassword
      user.save()

      return user
    },
  },
}

export default UserResolver
