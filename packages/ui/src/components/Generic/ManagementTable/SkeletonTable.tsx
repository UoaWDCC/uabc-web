import {
  Center,
  Checkbox,
  Loading,
  NativeTable,
  Skeleton,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@yamada-ui/react"
import { type FC, memo } from "react"

export const SkeletonTable: FC = memo(() => {
  return (
    <TableContainer>
      <NativeTable borderCollapse="separate" borderWidth="1px" rounded="md">
        <Thead>
          <Tr>
            <Th px="3" py="2" w="0">
              <Center h="full">
                <Checkbox disabled />
              </Center>
            </Th>
            <Th w="200px">
              <Skeleton>Name</Skeleton>
            </Th>
            <Th>
              <Skeleton>Email</Skeleton>
            </Th>
            <Th textAlign="center" w="120px">
              <Skeleton>Role</Skeleton>
            </Th>
            <Th textAlign="center" w="150px">
              <Skeleton>Remaining</Skeleton>
            </Th>
            <Th w="150px">
              <Skeleton>University</Skeleton>
            </Th>
            <Th textAlign="center" w="4" />
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td colSpan={7} h="3xs">
              <Center h="full">
                <Loading fontSize="5xl" />
              </Center>
            </Td>
          </Tr>
        </Tbody>
      </NativeTable>
    </TableContainer>
  )
})

SkeletonTable.displayName = "SkeletonTable"
