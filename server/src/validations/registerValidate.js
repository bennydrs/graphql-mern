import { UserInputError } from "apollo-server-core"

export const registerValidate = ({ email, password }) => {
  if (email === "") {
    throw new UserInputError("Invalid email")
  }

  if (
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  ) {
    throw new UserInputError("Invalid email", {
      argumentName: "email",
    })
  }

  if (password.length <= 3) {
    throw new UserInputError("Length must be greater than 3", {
      argumentName: "password",
    })
  }
}
