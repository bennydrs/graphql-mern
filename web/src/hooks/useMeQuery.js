import { useQuery } from "@apollo/client"
import { GET_ME } from "../graphql/queries"

const useMeQuery = () => useQuery(GET_ME)

export default useMeQuery
