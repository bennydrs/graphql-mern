import { useMutation } from "@apollo/client"
import { Alert, AlertIcon, Box, Button, Flex, Stack, Text } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import InputField from "../components/InputField"
import { LOGIN_MUTATION } from "../graphql/mutations"
import { GET_ME } from "../graphql/queries"
import { setAccessToken } from "../utils/accessToken"

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

const Login = () => {
  const [login, { error }] = useMutation(LOGIN_MUTATION)
  let navigate = useNavigate()
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "ben@ben.com",
      password: "ben@ben.com",
    },
  })

  const onSubmit = async (data) => {
    await login({
      variables: data,
      update: (cache, { data }) => {
        if (!data) {
          return null
        }
        cache.writeQuery({
          query: GET_ME,
          data: {
            me: data.login.user,
          },
        })
      },
      onCompleted: async (data) => {
        await setAccessToken(data.login.accessToken)
        navigate("/")
      },
    })
  }

  return (
    <Flex align="center" justify="center" width="full">
      <Box w="md" borderWidth="1px" borderRadius="lg" p="7">
        {error?.graphQLErrors.map(({ message }, i) => (
          <div key={i}>
            <Alert status="error" mb={2}>
              <AlertIcon />
              {message}
            </Alert>
          </div>
        ))}
        <Text fontSize="2xl" textAlign="center" mb={4}>
          Login
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
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
              }}
            />
          </Stack>
          <Button
            type="submit"
            isFullWidth
            colorScheme="teal"
            my={4}
            disabled={isSubmitting || !isValid}
          >
            Login
          </Button>
        </form>
      </Box>
    </Flex>
  )
}

// const Login = () => {
//   const [email, setEmail] = useState("ben@ben.com")
//   const [password, setPassword] = useState("ben")
//   const [login, { loading }] = useMutation(LOGIN)
//   let navigate = useNavigate()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const response = await login({
//       variables: {
//         email,
//         password,
//       },
//       update: (cache, { data }) => {
//         if (!data) {
//           return null
//         }
//         cache.writeQuery({
//           query: gql`
//             query Me {
//               me {
//                 id
//                 email
//               }
//             }
//           `,
//           data: {
//             me: data.login.user,
//           },
//         })
//       },
//     })
//     if (response && response.data) {
//       setAccessToken(response.data.login.accessToken)
//     }
//     navigate("/")
//   }

//   return (
//     <Flex align="center" justify="center" width="full">
//       <Box w="md">
//         <Heading as="h4" size="md" mb={3}>
//           Login
//         </Heading>
//         <form onSubmit={handleSubmit}>
//           <Stack spacing={3}>
//             <Input
//               type="email"
//               value={email}
//               placeholder="email"
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={loading}
//             />
//             <Input
//               type="password"
//               value={password}
//               placeholder="password"
//               onChange={(e) => setPassword(e.target.value)}
//               disabled={loading}
//             />
//           </Stack>
//           <Button
//             type="submit"
//             colorScheme="teal"
//             mt={3}
//             disabled={loading || password === "" || email === ""}
//           >
//             Login
//           </Button>
//         </form>
//       </Box>
//     </Flex>
//   )
// }

export default Login
