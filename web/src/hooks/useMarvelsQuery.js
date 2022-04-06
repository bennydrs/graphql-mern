import { useQuery } from "@apollo/client"
import { GET_MARVELS } from "../graphql/queries"

const useMarvelsQuery = (args) =>
  useQuery(GET_MARVELS, {
    fetchPolicy: "network-only",
    ...args,
  })

export default useMarvelsQuery
