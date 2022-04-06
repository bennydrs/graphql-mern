import { useMutation } from "@apollo/client"
import { Button, Stack, useToast } from "@chakra-ui/react"
import React from "react"
import { useForm } from "react-hook-form"
import { UPDATE_USER_MUTATION } from "../../graphql/mutations"
import { GET_ME } from "../../graphql/queries"
import useMeQuery from "../../hooks/useMeQuery"
import InputField from "../InputField"

const EditUserForm = ({ close }) => {
  const { data: user } = useMeQuery()
  const [updateUser] = useMutation(UPDATE_USER_MUTATION)
  const toast = useToast()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: user?.me.name,
    },
  })

  const onSubmit = async (data) => {
    await updateUser({
      variables: {
        name: data.name,
        userId: user?.me.id,
      },
      onCompleted: () => {
        toast({
          title: "User Updated",
          status: "success",
          duration: 9000,
          isClosable: true,
        })
        close()
      },
      update: (cache, { data }) => {
        if (!data) {
          return null
        }
        cache.writeQuery({
          query: GET_ME,
          data: {
            me: data.updateUser,
          },
        })
      },
      onError: (error) => {
        console.log(error)
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <InputField
          name="name"
          type="name"
          placeholder="Name"
          control={control}
          rules={{
            required: "Name is required",
          }}
        />
      </Stack>
      <Stack mt={3}>
        <Button type="submit" colorScheme="teal" disabled={isSubmitting || !isDirty || !isValid}>
          Update
        </Button>
        <Button onClick={close} colorScheme="red" disabled={isSubmitting}>
          Cancel
        </Button>
      </Stack>
    </form>
  )
}

export default EditUserForm
