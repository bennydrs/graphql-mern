import { gql } from "@apollo/client"

export const GET_ME = gql`
  query Me {
    me {
      id
      email
      name
    }
  }
`

export const GET_USERS = gql`
  query Users {
    users {
      id
      email
      name
    }
  }
`

export const GET_MARVELS = gql`
  query Marvels($limit: Int, $page: Int, $search: String, $filterBy: Filter, $sortBy: Sort) {
    marvels(limit: $limit, page: $page, search: $search, filterBy: $filterBy, sortBy: $sortBy) {
      data {
        id
        title
        year
        type
      }
      paginator {
        totalMarvels
        limit
        totalPages
        page
        pagingCounter
        hasPrevPage
        hasNextPage
        prevPage
        nextPage
      }
    }
  }
`
