import { useMutation } from "@apollo/client"
import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react"
import React from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toErrorMap } from "../utils/toErrorMap"
import InputField from "../components/InputField"
import { useToast } from "@chakra-ui/react"
import { REGISTER_MUTATION } from "../graphql/mutations"

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

const Register = () => {
  const [signup] = useMutation(REGISTER_MUTATION)
  const navigate = useNavigate()
  const toast = useToast()
  const {
    formState: { isDirty, isValid, isSubmitting },
    handleSubmit,
    reset,
    setError,
    control,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "ben@ben.com",
      password: "",
    },
  })

  const onSubmit = async (data) => {
    await signup({
      variables: data,
      onError: ({ graphQLErrors }) => {
        toErrorMap(graphQLErrors, setError)
      },
      onCompleted: () => {
        reset()
        toast({
          title: "Account created.",
          description: "We've created your account for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        })
        navigate("/login")
      },
    })
  }

  return (
    <Flex align="center" justify="center" width="full">
      <Box w="md" borderWidth="1px" borderRadius="lg" p="7">
        <Text fontSize="2xl" textAlign="center" mb={4}>
          Register
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <InputField
              name="name"
              placeholder="Name"
              control={control}
              rules={{
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name should be at least 3 characters long",
                },
              }}
            />
            <InputField
              name="email"
              placeholder="Email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: { value: EMAIL_REGEX, message: "Email is invalid" },
              }}
            />
            <InputField
              name="password"
              type="password"
              placeholder="Password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 4,
                  message: "Password should be at least 4 characters long",
                },
              }}
            />
          </Stack>
          <Button
            type="submit"
            colorScheme="teal"
            disabled={isSubmitting || !isDirty || !isValid}
            my={4}
            isFullWidth
          >
            Register
          </Button>
        </form>
      </Box>
    </Flex>
  )
}

export default Register
