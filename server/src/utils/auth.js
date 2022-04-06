import { AuthenticationError } from "apollo-server-core"
import { sign, verify } from "jsonwebtoken"
import { User } from "../models/User"

export const createAccessToken = (user) => {
  return sign({ userId: user.id, sessionId: user.sessionId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  })
}

export const createRefreshToken = (user) => {
  return sign(
    { userId: user.id, sessionId: user.sessionId, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  )
}

export const getUser = async (req) => {
  let token
  const authorization = req.headers["authorization"]
  if (!authorization) {
    return null
  }

  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1]
    try {
      const decoded = await verify(token, process.env.ACCESS_TOKEN_SECRET)
      const user = await User.findOne({ _id: decoded.userId }).select("-password")
      if (!user) {
        return null
      }
      if (!user.sessionId) {
        return null
      }
      req.user = user
      return user
    } catch (error) {
      return null
    }
  }
  if (!token) {
    return null
  }
}

export const protect = (user) => {
  if (!user) throw new AuthenticationError("not authenticated")
}

export const sendRefreshToken = (res, token) => {
  res.cookie("jid", token, {
    httpOnly: true,
    path: "/refresh-token",
    secure: process.env.NODE_ENV !== "development",
  })
}
