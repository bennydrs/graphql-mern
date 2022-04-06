import { ListItem, UnorderedList } from "@chakra-ui/react"
import React from "react"
import useUsersQuery from "../hooks/useUsersQuery"

const Home = () => {
  const { data, error, loading } = useUsersQuery()

  if (loading || !data) return <div>loading...</div>
  if (error) return <div>something went wrong</div>

  return (
    <div>
      <h1>Users: </h1>
      <UnorderedList>
        {data.users.map((user) => (
          <ListItem key={user.id}>
            {user.name} - {user.email}
          </ListItem>
        ))}
      </UnorderedList>
    </div>
  )
}

export default Home
