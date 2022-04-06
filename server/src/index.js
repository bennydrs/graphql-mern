import "dotenv/config"
import { ApolloServer } from "apollo-server-express"
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core"
import express from "express"
import http from "http"
import mongoose from "mongoose"
import resolvers from "./resolvers"
import typeDefs from "./typeDefs"
import { createAccessToken, createRefreshToken, getUser, sendRefreshToken } from "./utils/auth"
import cookieParser from "cookie-parser"
import cors from "cors"
import { verify } from "jsonwebtoken"
import { User } from "./models/User"

const startServer = async () => {
  const app = express()
  const whitelist = [process.env.CLIENT_URL, "https://studio.apollographql.com"]
  const corsOptions = {
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  }
  app.use(cors(corsOptions))
  app.get("/", (_req, res) => res.send("hello"))
  app.use(cookieParser())
  const httpServer = http.createServer(app)

  app.post("/refresh-token", async (req, res) => {
    const token = req.cookies.jid
    if (!token) {
      return res.send({ ok: false, accessToken: "" })
    }
    let payload
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
      console.log(error)
      return res.send({ ok: false, accessToken: "" })
    }

    const user = await User.findOne({ _id: payload.userId })

    if (!user) {
      return res.send({ ok: false, accessToken: "" })
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" })
    }

    sendRefreshToken(res, createRefreshToken(user))

    return res.send({ ok: true, accessToken: createAccessToken(user) })
  })

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: async ({ req, res }) => {
      const user = await getUser(req)
      return { req, res, user }
    },
  })

  await server.start()
  server.applyMiddleware({ app, cors: false })

  mongoose.connect("mongodb://localhost:27017/test")

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve))
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
}

startServer()
