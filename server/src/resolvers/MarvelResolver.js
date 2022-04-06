import { Marvel } from "../models/Marvel"

const PostLabels = {
  docs: "data",
  meta: "paginator",
  totalDocs: "totalMarvels",
}

const MarvelResolver = {
  Query: {
    marvels: async (_, { page, limit, filterBy, sortBy, search }) => {
      let query = {}
      let sorting = {}

      if (filterBy) {
        for (var key in filterBy) {
          if (filterBy[key] === null) {
            delete filterBy[key]
          }
          query = filterBy
        }
      }
      if (search) {
        query = {
          title: {
            $regex: new RegExp(`\\b${search}`),
            $options: "i",
          },
        }
      }
      if (sortBy) sorting = sortBy

      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: PostLabels,
        sort: sorting,
      }

      const marvels = await Marvel.paginate(query, options)
      return marvels
    },
    marvel: async (_parent, args, _context, _info) => {
      const { id } = args
      return Marvel.findOne({ _id: id })
    },
    searchMarvel: async (_, { keyword }) => {
      if (!keyword) return null
      try {
        const data = await Marvel.find({
          title: {
            $regex: new RegExp(`\\b${keyword}`),
            $options: "i",
          },
        })
        console.log(data)
        return data
      } catch (error) {
        console.log({ error })
      }
    },
  },
  Mutation: {
    addMarvel: async (_, { newMarvel }) => {
      try {
        return await Marvel.create(newMarvel)
      } catch (error) {
        console.log({ error })
      }
    },
  },
}

export default MarvelResolver
