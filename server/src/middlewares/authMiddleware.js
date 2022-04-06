import { verify } from "jsonwebtoken"
import { User } from "../models/User"

export const AuthMiddleware = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]

      const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET)

      req.user = await User.findById(decoded.id).select("-password")
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error("Not authorized, token failed")
    }
  }

  if (!token) {
    res.status(401)
    throw new Error("Not authorized, no token")
  }

  next()
}
