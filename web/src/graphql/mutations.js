import { gql } from "@apollo/client"

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user {
        id
        email
        name
      }
    }
  }
`

export const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(newuser: { name: $name, email: $email, password: $password }) {
      name
      email
    }
  }
`

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($userId: String, $name: String) {
    updateUser(userId: $userId, name: $name) {
      id
      name
      email
    }
  }
`

export const CHANGE_PASSWORD = gql`
  mutation UpdatePassword($oldPassword: String, $newPassword: String) {
    updatePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      id
      name
      email
    }
  }
`

export const ADD_MARVEL = gql`
  mutation AddMarvel($title: String!, $year: Int!, $type: String!) {
    addMarvel(newMarvel: { title: $title, year: $year, type: $type }) {
      id
      title
      year
      type
    }
  }
`
