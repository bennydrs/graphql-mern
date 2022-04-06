import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache, Observable } from "@apollo/client"
import { onError } from "@apollo/client/link/error"
import { TokenRefreshLink } from "apollo-link-token-refresh"
import jwtDecode from "jwt-decode"
import { getAccessToken, setAccessToken } from "../utils/accessToken"

export const URI = "http://localhost:4000"
const cache = new InMemoryCache()

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle = null
      Promise.resolve(operation)
        .then((operation) => {
          const accessToken = getAccessToken()
          if (accessToken) {
            operation.setContext({
              headers: {
                authorization: `Bearer ${accessToken}`,
              },
            })
          }
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          })
        })
        .catch(observer.error.bind(observer))

      return () => {
        if (handle) handle.unsubscribe()
      }
    })
)

const refreshLink = new TokenRefreshLink({
  accessTokenField: "accessToken",
  isTokenValidOrUndefined: () => {
    const token = getAccessToken()

    if (!token) {
      return true
    }

    try {
      const { exp } = jwtDecode(token)
      if (Date.now() >= exp * 1000) {
        return false
      } else {
        return true
      }
    } catch {
      return false
    }
  },
  fetchAccessToken: () => {
    return fetch(`${URI}/refresh-token`, {
      method: "POST",
      credentials: "include",
    })
  },
  handleFetch: (accessToken) => {
    setAccessToken(accessToken)
  },
  handleError: (err) => {
    console.warn("Your refresh token is invalid. Try to relogin")
    console.error(err)
  },
})

export const client = new ApolloClient({
  link: ApolloLink.from([
    refreshLink,
    onError(({ graphQLErrors, networkError }) => {
      console.log(graphQLErrors)
      console.log(networkError)
    }),
    requestLink,
    new createHttpLink({
      uri: `${URI}/graphql`,
      credentials: "include",
    }),
  ]),
  cache,
})

// const refreshLink = new TokenRefreshLink({
//   accessTokenField: "accessToken",
//   isTokenValidOrUndefined: () => {
//     const token = getAccessToken()

//     if (!token) {
//       return true
//     }

//     try {
//       const { exp } = jwtDecode(token)
//       if (Date.now() >= exp * 1000) {
//         return false
//       } else {
//         return true
//       }
//     } catch {
//       return false
//     }
//   },
//   fetchAccessToken: () => {
//     return fetch("http://localhost:4000/refresh-token", {
//       method: "POST",
//       credentials: "include",
//     })
//   },
//   handleFetch: (accessToken) => {
//     console.log("handle", accessToken)
//     setAccessToken(accessToken)
//   },
//   handleError: (err) => {
//     console.warn("Your refresh token is invalid. Try to relogin")
//     console.error(err)
//   },
// })

// const httpLink = createHttpLink({
//   uri: "http://localhost:4000/graphql",
//   credentials: "include",
// })

// const authLink = setContext((_, { headers }) => {
//   // get the authentication token from local storage if it exists
//   const accessToken = getAccessToken()
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: accessToken ? `Bearer ${accessToken}` : "",
//     },
//   }
// })

// const client = new ApolloClient({
//   link: authLink.concat(refreshLink).concat(httpLink),
//   cache,
// })
