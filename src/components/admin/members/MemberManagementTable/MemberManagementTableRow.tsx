'use client'

import type { Row } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import type { Member } from './columns'

interface MemberManagementTableRowProps {
  row: Row<Member>
  userId: string
}

export function MemberManagementTableRow({ row }: MemberManagementTableRowProps) {
  const name: string = row.getValue('name')
  const email: string = row.getValue('email')
  const prepaidSessions: string = row.getValue('prepaidSessions')

  return (
    <TableRow>
      <TableCell className="w-[75px] max-w-[125px] truncate sm:max-w-max">{name}</TableCell>
      <TableCell className="min-w-[100px] max-w-[150px] truncate xs:table-cell sm:max-w-full">
        {email}
      </TableCell>
      <TableCell className="min-w-[100px] max-w-[150px] text-center">{prepaidSessions}</TableCell>
      <TableCell className="p-4 text-center">
        <div className="flex h-10 items-center justify-center">
          <Button className="h-6 w-12" variant="outline">
            Edit
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
