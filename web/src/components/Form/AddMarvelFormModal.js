import { useMutation } from "@apollo/client"
import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import React from "react"
import { useForm } from "react-hook-form"
import { ADD_MARVEL } from "../../graphql/mutations"
import { GET_MARVELS } from "../../graphql/queries"
import InputField from "../InputField"

const AddMarvelFormModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { control, handleSubmit, register, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      year: null,
      type: "movie",
    },
  })
  const [addMarvel, { error }] = useMutation(ADD_MARVEL, {
    refetchQueries: [
      GET_MARVELS, // DocumentNode object parsed with gql
      "Marvels", // Query name
    ],
  })
  const toast = useToast()

  const initialRef = React.useRef()
  const finalRef = React.useRef()

  const onSubmit = async (data) => {
    await addMarvel({
      variables: {
        title: data.title,
        year: Number(data.year),
        type: data.type,
      },
      onCompleted: () => {
        reset()
        toast({
          title: "Marvel created.",
          status: "success",
          duration: 5000,
          isClosable: true,
        })
        onClose()
      },
    })
  }

  return (
    <div ref={finalRef}>
      <Button onClick={onOpen} colorScheme="blue" mb={6}>
        Add new marvel
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Create your account</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {error && (
                <Alert status="error" mb={2}>
                  <AlertIcon />
                  There was an error processing your request
                </Alert>
              )}
              <Stack>
                <InputField
                  name="title"
                  label="Title"
                  placeholder="Title"
                  control={control}
                  rules={{
                    required: "Title is required",
                  }}
                  ref={initialRef}
                />
                <InputField
                  name="year"
                  label="Year"
                  type="number"
                  placeholder="Year"
                  control={control}
                  rules={{
                    required: "Year is required",
                  }}
                />
                <FormControl>
                  <FormLabel htmlFor="type" style={{ textTransform: "capitalize" }}>
                    Type
                  </FormLabel>
                  <Select {...register("type")}>
                    <option value="movie" selected>
                      Movie
                    </option>
                    <option value="series">Series</option>
                  </Select>
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default AddMarvelFormModal
