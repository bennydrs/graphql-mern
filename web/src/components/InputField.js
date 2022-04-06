import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from "@chakra-ui/react"
import React from "react"
import { Controller } from "react-hook-form"

const InputField = React.forwardRef(({ name, label, control, rules, textarea, ...props }, ref) => {
  let InputOrTextarea = Input

  if (textarea) {
    InputOrTextarea = Textarea
  }

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState: { error }, formState: { isSubmitting } }) => (
        <FormControl isInvalid={!!error}>
          <FormLabel htmlFor={name} style={{ textTransform: "capitalize" }}>
            {label}
          </FormLabel>
          <InputOrTextarea {...field} {...props} ref={ref} disabled={isSubmitting} />
          {error && <FormErrorMessage>{error.message || "error"}</FormErrorMessage>}
        </FormControl>
      )}
    />
  )
})

export default InputField
