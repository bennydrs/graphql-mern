import { useMutation } from "@apollo/client"
import { Alert, AlertIcon, Button, Stack, useToast } from "@chakra-ui/react"
import React from "react"
import { useForm } from "react-hook-form"
import { CHANGE_PASSWORD } from "../../graphql/mutations"
import InputField from "../InputField"

const ChangePassword = ({ close }) => {
  const [updatePassword, { error }] = useMutation(CHANGE_PASSWORD)
  const toast = useToast()

  const {
    handleSubmit,
    control,
    watch,
    formState: { isDirty, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const newPassword = watch("newPassword")

  const onSubmit = async (data) => {
    await updatePassword({
      variables: {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      },
      onCompleted: () => {
        toast({
          title: "Password Updated",
          status: "success",
          duration: 9000,
          isClosable: true,
        })
        close()
      },
    })
  }

  return (
    <>
      {error?.graphQLErrors.map(({ message }, i) => (
        <div key={i}>
          <Alert status="error" mb={2}>
            <AlertIcon />
            {message}
          </Alert>
        </div>
      ))}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <InputField
            name="oldPassword"
            label="Old Password"
            type="password"
            placeholder="Old Password"
            control={control}
            rules={{
              required: "Old password is required",
            }}
          />
          <InputField
            name="newPassword"
            label="New Password"
            type="password"
            placeholder="New Password"
            control={control}
            rules={{
              required: "New password is required",
            }}
          />
          <InputField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm Password"
            control={control}
            rules={{
              required: "Confirm password is required",
              validate: (value) => value === newPassword || "Password do not match",
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
    </>
  )
}

export default ChangePassword
