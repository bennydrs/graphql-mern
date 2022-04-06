import { Box, Button, Grid, GridItem, Heading, Stack, Text } from "@chakra-ui/react"
import React, { useCallback, useState } from "react"
import ChangePassword from "../components/Form/ChangePassword"
import EditUserForm from "../components/Form/EditUserForm"
import useMeQuery from "../hooks/useMeQuery"

const Profile = () => {
  const [isEdit, setIsEdit] = useState(false)
  const [isChangePassword, setIsChangePassword] = useState(false)
  const { data, loading } = useMeQuery()
  const closeIsEdit = useCallback(() => {
    setIsEdit(false)
    setIsChangePassword(false)
  }, [])

  if (loading) return <div>loading...</div>

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
      <GridItem colSpan={2}>
        <Heading as="h4" size="lg" mb={4}>
          Profile
        </Heading>

        <Text>Name</Text>
        <Text fontSize="2xl" mb={3}>
          {data.me.name}
        </Text>

        <Text>Email</Text>
        <Text fontSize="2xl">{data.me.email}</Text>
      </GridItem>
      <GridItem colSpan={1}>
        {isEdit ? (
          <Box borderWidth="1px" borderRadius="md" p={4}>
            <Heading size="md" mb={4}>
              Edit Profile
            </Heading>
            <EditUserForm close={closeIsEdit} />
          </Box>
        ) : isChangePassword ? (
          <Box borderWidth="1px" borderRadius="md" p={4}>
            <Heading size="md" mb={4}>
              Change Password
            </Heading>
            <ChangePassword close={closeIsEdit} />
          </Box>
        ) : (
          <Stack borderWidth="1px" borderRadius="lg" minW="sm" p={6}>
            <Button onClick={() => setIsEdit(true)} colorScheme="blue">
              Edit Profile
            </Button>
            <Button onClick={() => setIsChangePassword(true)} colorScheme="orange">
              Change Password
            </Button>
          </Stack>
        )}
      </GridItem>
    </Grid>
  )
}

export default Profile
