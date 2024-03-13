'use client'

import { useState } from 'react'
import { useTheme } from "next-themes"
import { format } from 'date-fns'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area, Line, ReferenceLine } from 'recharts'
import { MeanTimeToRecoveryTooltip } from './tooltip'
import useMeanTimeToRestore from './meantimetorestore'
import { dateFormatter, dayFormatter } from '@/lib/date-funcs';

const calculateMean = data => {
  if (data.length < 1) {
    return
  }
  return data.reduce((prev, current) => prev + current) / data.length
}

export function MeanTimeToRecoveryChart({ appName, dateRange }) {

  const { resolvedTheme } = useTheme()
  const animationDuration = 1000

  // Chart colors
  const strokeGrid = '#d4d4d4'            // Neutral 300
  const strokeGridDark = '#404040'        // Neutral 700
  const strokeCursor = '#10b981'          // Emerald 500
  const strokeActiveDot = '#ffffff'       // White
  const strokeActiveDotDark = '#171717'   // Neutral 900
  const strokeAnomaly = '#f97316'         // Orange 500

  const fillRange = '#a7f3d0'             // Emerald 200
  const fillRangeDark = '#064e3b'         // Emerald 900
  const strokeRange = '#10b981'           // Emerald 500
  const strokeRollingAverage = '#10b981'  // Emerald 500
  const strokeGoal = '#f59e0b'            // Amber 500

  const { mttrData, loading } = useMeanTimeToRestore(appName, dateRange);
  console.log('Chart mttrData: ', mttrData)

  if (loading) {
    return <div>Loading...</div>; // Render loading state while data is being fetched
  }

  // Calculate the mean
  const averages = mttrData.map(element => {
    return element.rollingAverage
  })

  const chartMean = calculateMean(averages)

  // // Reports
  // const [reportMeanTimeToRecoveryData, setReportMeanTimeToRecoveryData] = useState(null)
  // const [showReportMeanTimeToRecoveryData, setShowReportMeanTimeToRecoveryData] = useState(false)

  // function handleChartClick(event) {
  //   setReportMeanTimeToRecoveryData(event)
  //   setShowReportMeanTimeToRecoveryData(true)
  // }

  // // Anomaly detection
  // const showAnomalyWarning = data.some((day) => {
  //   if (day.rollingAverage < day.expectedRange[0] || day.rollingAverage > day.expectedRange[1]) { return true }
  //   return false
  // })

  const customAnomalyLabel = props => {
    return (
      <g className="w-[32px] h-[32px] fill-none" transform={`translate(${props.viewBox.x - 16}, ${props.viewBox.y + 1})`}>
        <rect className="fill-orange-50 dark:fill-orange-950 stroke-orange-600 dark:stroke-orange-400 stroke-2" width="32" height="32" rx="16" />
        <path className="fill-orange-600 dark:fill-orange-400" d="M23.799 21.026 17.482 9.38a1.668 1.668 0 0 0-.683-.68 1.693 1.693 0 0 0-2.284.68L8.199 21.026A1.678 1.678 0 0 0 9.685 23.5h12.628a1.7 1.7 0 0 0 1.308-.615 1.671 1.671 0 0 0 .178-1.859Zm-7.8.474a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-3.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4Z" />
      </g>
    )
  }

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={mttrData} margin={{ top: 0, left: 0, right: 4, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={resolvedTheme === 'dark' ? strokeGridDark : strokeGrid} />
          <XAxis style={{ fontSize: '0.75rem' }} dataKey="timestamp" axisLine={false} tickLine={false} tickFormatter={dateFormatter} />
          <YAxis style={{ fontSize: '0.75rem' }} domain={[0, 28]} axisLine={false} tickLine={false} tickFormatter={dayFormatter} />
          <Tooltip content={<MeanTimeToRecoveryTooltip />} cursor={{ stroke: strokeCursor }} />
          <Area type="monotone" dataKey="expectedRange" activeDot={resolvedTheme === 'dark' ? { stroke: strokeActiveDotDark } : { stroke: strokeActiveDot }} fill={resolvedTheme === 'dark' ? fillRangeDark : fillRange} stroke={strokeRange} strokeWidth={0} strokeDasharray="4 4" animationDuration={animationDuration} />
          <Line type="monotone" dataKey="time_to_resolve" dot={false} activeDot={resolvedTheme === 'dark' ? { stroke: strokeActiveDotDark } : { stroke: strokeActiveDot }} stroke={strokeRollingAverage} strokeWidth={3} strokeLinecap="round" animationDuration={animationDuration} />
          <Line type="monotone" dataKey="goal" dot={false} activeDot={resolvedTheme === 'dark' ? { stroke: strokeActiveDotDark } : { stroke: strokeActiveDot }} stroke={strokeGoal} strokeWidth={2} strokeDasharray="4 4" strokeLinecap="round" isAnimationActive={false} />

          {/* {data.map((day, index) => (
            day.rollingAverage < day.expectedRange[0] || day.rollingAverage > day.expectedRange[1] && (
              <ReferenceLine className="anomaly-reference-line" key={index} x={day.date} stroke={strokeAnomaly} label={customAnomalyLabel} />
            )
          ))} */}
        </ComposedChart>
      </ResponsiveContainer>
      {/* <MeanTimeToRecoveryReport reportMeanTimeToRecoveryData={reportMeanTimeToRecoveryData} showReportMeanTimeToRecoveryData={showReportMeanTimeToRecoveryData} setShowReportMeanTimeToRecoveryData={setShowReportMeanTimeToRecoveryData} /> */}
    </>
  )
}