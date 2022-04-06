import { gql } from "apollo-server-core"

const UserTypeDef = gql`
  type Query {
    users: [User!]!
    bye: String!
    me: User
  }
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
  }
  type Mutation {
    register(newuser: UserInput!): User!
    login(email: String, password: String): LoginResponse!
    logout: Boolean
    revokeRefreshTokenForUser(userId: String): Boolean
    updateUser(userId: String, name: String): User!
    updatePassword(oldPassword: String, newPassword: String): User!
  }
  input UserInput {
    name: String!
    email: String!
    password: String!
  }
  type LoginResponse {
    accessToken: String!
    user: User!
  }
`
export default UserTypeDef
