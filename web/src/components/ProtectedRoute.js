import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import useMeQuery from "../hooks/useMeQuery"

const ProtectedRoute = ({ children }) => {
  const { data, loading } = useMeQuery()
  let location = useLocation()

  if (loading) return ""

  if (!loading && !data?.me) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
