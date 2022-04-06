import { gql } from "apollo-server-core"

const MarvelTypeDef = gql`
  type Query {
    marvels(page: Int, limit: Int, filterBy: Filter, sortBy: Sort, search: String): MarvelPaginator!
    marvel(id: ID!): Marvel
    searchMarvel(keyword: String!): [Marvel]!
  }
  type Mutation {
    addMarvel(newMarvel: MarvelInput!): Marvel!
  }
  type Marvel {
    id: ID!
    title: String!
    year: Int!
    type: String!
  }
  input MarvelInput {
    title: String!
    year: Int!
    type: String!
  }
  input Sort {
    title: AllowedSort
    year: AllowedSort
  }
  enum AllowedSort {
    desc
    asc
  }
  input Filter {
    year: Int
    type: String
  }
  type MarvelPaginator {
    data: [Marvel!]!
    paginator: Paginator!
  }
  type Paginator {
    totalMarvels: Int
    limit: Int
    totalPages: Int
    page: Int
    pagingCounter: Int
    hasPrevPage: Boolean
    hasNextPage: Boolean
    prevPage: Int
    nextPage: Int
  }
`

export default MarvelTypeDef
