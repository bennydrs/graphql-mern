import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Center,
  Select,
  Box,
  TableCaption,
  Input,
  Stack,
  Flex,
  Tooltip,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react"
import React, { useState } from "react"
import useMarvelsQuery from "../hooks/useMarvelsQuery"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons"

const years = [2008, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]

const Marvel = () => {
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState("")
  const [filterBy, setFilterBy] = useState({ year: null, type: null })
  const [sortBy, setSortBy] = useState({ title: "asc", year: "asc" })

  const { data, loading } = useMarvelsQuery({
    variables: {
      limit,
      page,
      search: keyword,
      filterBy,
      sortBy,
    },
  })

  const {
    page: currentPage,
    totalMarvels,
    totalPages,
    hasPrevPage,
    hasNextPage,
  } = data?.marvels.paginator || {}

  const handlePageLimit = (e) => {
    setLimit(Number(e.target.value))
  }

  const gotoPage = (page) => {
    setPage(page)
  }

  const handleSearch = (e) => {
    setPage(1)
    setKeyword(e.target.value)
  }

  const handleFilterYear = (e) => {
    setPage(1)
    const year = e.target.value === "all" ? null : Number(e.target.value)
    setFilterBy((prevState) => ({ ...prevState, year }))
  }

  const handleFilterType = (e) => {
    setPage(1)
    const type = e.target.value === "all" ? null : e.target.value
    setFilterBy((prevState) => ({ ...prevState, type }))
  }

  const handleSort = (sort) => {
    if (sort === "title") {
      setSortBy({
        title: sortBy.title === "asc" ? "desc" : "asc",
      })
    }

    if (sort === "year") {
      setSortBy({
        year: sortBy.year === "asc" ? "desc" : "asc",
      })
    }
  }

  return (
    <>
      <Stack mb={5} direction="row">
        <Box>
          <Select onChange={handlePageLimit} value={limit}>
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Box>
        <Box w={60}>
          <Input placeholder="Search" onChange={handleSearch} type="search" />
        </Box>
        <Box w={28}>
          <Select onChange={handleFilterYear} value={filterBy.year || "year"}>
            <option value="all">All Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </Box>
        <Box w={28}>
          <Select onChange={handleFilterType} value={filterBy.type || "type"}>
            <option value="all">All Type</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
          </Select>
        </Box>
      </Stack>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>
            Showing {currentPage} to {totalPages} of {totalMarvels} entries
          </TableCaption>
          <Thead>
            <Tr>
              <Th onClick={() => handleSort("title")} _hover={{ cursor: "pointer" }}>
                Title{" "}
                {sortBy.title && (sortBy.title === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />)}
              </Th>
              <Th onClick={() => handleSort("year")} _hover={{ cursor: "pointer" }}>
                Year{" "}
                {sortBy.year && (sortBy.year === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />)}
              </Th>
              <Th>Type</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading && (
              <Tr>
                <Td colSpan={3}>
                  <Center>Loading...</Center>
                </Td>
              </Tr>
            )}
            {data?.marvels.data.length === 0 && (
              <Tr>
                <Td colSpan={3}>
                  <Center>No data</Center>
                </Td>
              </Tr>
            )}
            {data?.marvels.data.map((marvel) => (
              <Tr key={marvel.id}>
                <Td>{marvel.title}</Td>
                <Td>{marvel.year}</Td>
                <Td>{marvel.type}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex justifyContent="space-between" m={4} alignItems="center" w={100}>
        <Flex>
          <Tooltip label="First Page">
            <IconButton
              onClick={() => gotoPage(1)}
              isDisabled={!hasPrevPage}
              icon={<ArrowLeftIcon h={3} w={3} />}
              mr={2}
            />
          </Tooltip>
          <Tooltip label="Previous Page">
            <IconButton
              onClick={() => setPage((page) => page - 1)}
              isDisabled={!hasPrevPage}
              icon={<ChevronLeftIcon h={6} w={6} />}
            />
          </Tooltip>
        </Flex>

        <Flex alignItems="center">
          <NumberInput
            mx={2}
            w={20}
            min={1}
            max={totalPages}
            onChange={(value) => gotoPage(Number(value))}
            value={page}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Flex>

        <Flex>
          <Tooltip label="Next Page">
            <IconButton
              onClick={() => setPage((page) => page + 1)}
              isDisabled={!hasNextPage}
              icon={<ChevronRightIcon h={6} w={6} />}
            />
          </Tooltip>
          <Tooltip label="Last Page">
            <IconButton
              onClick={() => gotoPage(totalPages)}
              isDisabled={!hasNextPage}
              icon={<ArrowRightIcon h={3} w={3} />}
              ml={2}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </>
  )
}

export default Marvel
