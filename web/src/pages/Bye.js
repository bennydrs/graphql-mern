import { gql, useQuery } from "@apollo/client"
import React from "react"

const BYE = gql`
  query Bye {
    bye
  }
`

const Bye = () => {
  const { data, loading, error } = useQuery(BYE, { fetchPolicy: "network-only" })

  if (loading) return <div>loading...</div>
  if (error) {
    return <div>error</div>
  }
  if (!data) return <div>no data</div>

  return <div>{data.bye}</div>
}

export default Bye
