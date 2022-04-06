import { Container } from "@chakra-ui/react"
import { BrowserRouter, Route, Routes as RoutesWrap } from "react-router-dom"
import Header from "./components/Header"
import ProtectedRoute from "./components/ProtectedRoute"
import Bye from "./pages/Bye"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Marvel from "./pages/Marvel"
import Profile from "./pages/Profile"
import Register from "./pages/Register"

const Routes = () => {
  return (
    <BrowserRouter>
      <Header />
      <Container maxW="container.xl" mt={30}>
        <RoutesWrap>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route
            exact
            path="/bye"
            element={
              <ProtectedRoute>
                <Bye />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route exact path="/marvel" element={<Marvel />} />
        </RoutesWrap>
      </Container>
    </BrowserRouter>
  )
}

export default Routes
