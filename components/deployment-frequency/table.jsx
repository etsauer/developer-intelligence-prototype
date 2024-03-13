'use client'

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Orbit, FileCode, CalendarCheck, Blocks, Fingerprint } from "lucide-react"
import useDeploymentFrequencyData from './deploymentFrequency';
import { dateFormatter } from '@/lib/date-funcs';

export function DeploymentFrequencyTable({ dateRange, appName }) {

  const { dfData, loading } = useDeploymentFrequencyData(appName, dateRange);
  console.log('Table dfData: ', dfData)

  if (loading) {
    return <div>Loading...</div>; // Render loading state while data is being fetched
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Deployment Name</TableHead>
          <TableHead>Image Sha</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
      {dfData.map (({ image, timestamp }) => (
          <TableRow key={image}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Blocks className="w-4 h-4" />{appName}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4" /> {image}
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