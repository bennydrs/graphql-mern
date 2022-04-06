import { gql, useMutation } from "@apollo/client"

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`

const useLogoutMutation = () => useMutation(LOGOUT)

export default useLogoutMutation
