'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar, GitCommit, GitGraph, Timer } from "lucide-react"
import { getDaysBetweenDates } from '@/components/date-range-selector'
import {dateFormatter, dayFormatter} from '@/lib/date-funcs';

export function LeadTimeForChangeTable({ dateRange, appName }) {
  
  const [ltfcData, setLtfcData] = useState([])
  useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_PELORUS_API_URL}/sdp/lead_time_for_change/${appName}/data?range=${getDaysBetweenDates(dateRange)}d&start=${dateRange.to.getTime() / 1000}`)
      .then((response) => response.json()).then((data) => data.sort((d1, d2) => (d1.timestamp > d2.timestamp) ? 1 : (d1.timestamp < d2.timestamp) ? -1 : 0 ))
      .then((sortedData) => {
        setLtfcData(sortedData)
      })
  }, [dateRange, appName])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Commit SHA</TableHead>
          <TableHead>Commit Date</TableHead>
          <TableHead>Lead time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ltfcData.map (({ commit, timestamp, lead_time }) => (
          <TableRow key={commit}>
            <TableCell>
              <div className="flex items-center gap-2">
                <GitGraph className="w-4 h-4" /> {commit}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> { dateFormatter(timestamp) }
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4" /> {dayFormatter(lead_time)} days
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}