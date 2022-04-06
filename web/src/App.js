import { Box, Spinner } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import "./App.css"
import { URI } from "./config/client"
import Routes from "./Routes"
import { setAccessToken } from "./utils/accessToken"

function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    setLoading(true)
    fetch(`${URI}/refresh-token`, { method: "POST", credentials: "include" })
      .then(async (res) => {
        const { accessToken } = await res.json()
        setAccessToken(accessToken)
      })
      .catch((err) => {
        setError("Network error")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Spinner />
      </Box>
    )
  if (error) return <div>{error}</div>

  return <Routes />
}

export default App
