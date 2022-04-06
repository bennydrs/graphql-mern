export const toErrorMap = (errors, setError) => {
  errors.forEach((error) => {
    setError(error.extensions?.argumentName, { type: "manual", message: error.message })
  })
}
