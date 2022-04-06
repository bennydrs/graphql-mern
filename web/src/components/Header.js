import React from "react"
import { Link as ReactLink, useNavigate } from "react-router-dom"
import useLogoutMutation from "../hooks/useLogoutMutation"
import useMeQuery from "../hooks/useMeQuery"
import { setAccessToken } from "../utils/accessToken"
import { Flex, Heading, Box, Link, useColorModeValue, Container, Stack } from "@chakra-ui/react"
import { ThemeToggle } from "./ThemeToggle"

const Header = () => {
  const { data, loading } = useMeQuery()
  const [logout, { client }] = useLogoutMutation()
  let navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    await setAccessToken("")
    await client?.resetStore()
    navigate("/login")
  }

  let bodyMe = null

  if (loading) {
    bodyMe = null
  } else if (data && data.me) {
    bodyMe = (
      <>
        <Link as={ReactLink} to="/bye">
          Bye
        </Link>
        <Link as={ReactLink} to="/marvel">
          Marvel
        </Link>
        <Link as={ReactLink} to="/profile">
          {data.me.email}
        </Link>
        <div>
          {!loading && data && data.me ? <button onClick={handleLogout}>logout</button> : null}
        </div>
      </>
    )
  } else {
    bodyMe = (
      <>
        <Link as={ReactLink} to="/register">
          Register
        </Link>
        <Link as={ReactLink} to="/login">
          Login
        </Link>
      </>
    )
  }

  return (
    <Box
      borderBottom={1}
      borderStyle={"solid"}
      borderColor={useColorModeValue("gray.200", "gray.900")}
      bgGradient="linear(to-l, #7928CA, #28ca76)"
      color={useColorModeValue("gray.100", "white")}
      boxShadow="sm"
    >
      <Flex zIndex={1} position="sticky" top={0} p={2}>
        <Container maxW="container.xl">
          <Flex flex={1} m="auto" align="center">
            <Link to="/">
              <Heading>GraphQL</Heading>
            </Link>
            <Box ml={"auto"}>
              <Stack spacing="20px" direction={["column", "row"]} align="center">
                <Link as={ReactLink} to="/">
                  Home
                </Link>

                {bodyMe}
                <ThemeToggle />
              </Stack>
            </Box>
          </Flex>
        </Container>
      </Flex>
    </Box>
  )
}

export default Header
