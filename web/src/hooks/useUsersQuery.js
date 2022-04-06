import { useQuery } from "@apollo/client"
import { GET_USERS } from "../graphql/queries"

const useUsersQuery = () => useQuery(GET_USERS, { fetchPolicy: "network-only" })

export default useUsersQuery
