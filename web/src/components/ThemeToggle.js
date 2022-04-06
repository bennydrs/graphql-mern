import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react"
import * as React from "react"

export const ThemeToggle = (props) => {
  const { toggleColorMode } = useColorMode()
  const text = useColorModeValue("dark", "light")
  const SwitchIcon = useColorModeValue(MoonIcon, SunIcon)

  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="ghost"
      color="current"
      marginLeft="2"
      onClick={toggleColorMode}
      borderRadius="6"
      icon={<SwitchIcon />}
      aria-label={`Switch to ${text} mode`}
      _hover={{ backgroundColor: "grey" }}
      {...props}
    />
  )
}
