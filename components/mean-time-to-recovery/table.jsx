'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Orbit, FileCode, CalendarCheck, Ticket, Timer } from "lucide-react"
import useMeanTimeToRestore from "./meantimetorestore";
import { dateFormatter, dayFormatter } from '@/lib/date-funcs';

export function MeanTimeToRecoveryTable({ dateRange, appName }) {

  const { mttrData, loading } = useMeanTimeToRestore(appName, dateRange);
  console.log('Table mttrData: ', mttrData)

  if (loading) {
    return <div>Loading...</div>; // Render loading state while data is being fetched
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ticket Reference</TableHead>
          <TableHead>App Name</TableHead>
          <TableHead>Time to Resolve</TableHead>
          <TableHead>Date Resolved</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
      {mttrData.map (({ issue_id, time_to_resolve, timestamp }) => (
          <TableRow key={issue_id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4" />{issue_id}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Orbit className="w-4 h-4" />{appName}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4" /> {dayFormatter(time_to_resolve)}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4" /> { dateFormatter(timestamp) }
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}