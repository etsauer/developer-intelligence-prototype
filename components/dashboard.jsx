'use client'

import { useState } from 'react'
import { subDays } from "date-fns"
import { ApplicationSelector } from '@/components/application-selector'
import { AppSelector } from '@/components/app-selector'
import { DateRangeSelector } from '@/components/date-range-selector'
import { LayoutGrid, TableIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { DeploymentFrequencyChart } from '@/components/deployment-frequency/chart'
import { LeadTimeForChangeChart } from '@/components/lead-time-for-change/chart'
import { IsolatedChangeFailureRateChart } from '@/components/change-failure-rate/iso-chart'
import { MeanTimeToRecoveryChart } from '@/components/mean-time-to-recovery/chart'

import { DeploymentFrequencyTabTrigger } from './deployment-frequency/tab-trigger'
import { ChangeFailureRateTabTrigger } from './change-failure-rate/tab-trigger'
import { LeadTimeForChangeTabTrigger } from './lead-time-for-change/tab-trigger'

import { DeploymentFrequencyTable } from './deployment-frequency/table'
import { LeadTimeForChangeTable } from './lead-time-for-change/table'
import { ChangeFailureRateTable } from './change-failure-rate/table'
import { MeanTimeToRecoveryTable } from './mean-time-to-recovery/table'

import { ScorecardScore } from './scorecard/score'
import { ScorecardAnalysis } from './scorecard/analysis'
import { ScorecardTrend } from './scorecard/trend'
import { MeanTimeToRecoveryTabTrigger } from './mean-time-to-recovery/tab-trigger'

export function Dashboard({ data, appList }) {

  const applicationsList = data.applications;
  // This code initializes the date range that the dashboard will show data from.
  // We start by checking if a previously selected date is cached in the browser.
  // If not, we default to the past 7 days
  const [activeDateRange, setActiveDateRange] = useState(() => {
    console.log('Initializing activeDateRange');
    const storedDateRange = localStorage.getItem('dateRange');
    if (storedDateRange) {
      console.log('Using stored date range');
      // Parse the stored dateRange and convert dates back to Date objects
      const parsedDateRange = JSON.parse(storedDateRange, (key, value) => {
        if (key === 'from' || key === 'to') {
          return new Date(value);
        }
        return value;
      });
      return parsedDateRange;
    } else {
      console.log('No stored date range found, using default');
      const defaultDaysAgo = 7;
      return {
        from: subDays(new Date(), defaultDaysAgo),
        to: new Date()
      };
    }
  });
  console.log('Date Range after initialization:', activeDateRange);

  const [activeApp, setActiveApp] = useState( appList[0].app )
  const [activeApplication, setActiveApplication] = useState(applicationsList[0].id)
  const [dataScorecard, setDataScorecard] = useState(applicationsList[0].scorecard[0])
  const [dataDeploymentFrequency, setDataDeploymentFrequency] = useState(applicationsList[0].metrics[1].data)
  const [dataLeadTimeForChange, setDataLeadTimeForChange] = useState(applicationsList[0].metrics[2].data)
  const [dataChangeFailureRate, setDataChangeFailureRate] = useState(applicationsList[0].metrics[0].data)
  const [dataMeanTimeToRecovery, setDataMeanTimeToRecovery] = useState(applicationsList[0].metrics[3].data)

  function changeActiveApplication(id) {
    setActiveApplication(id)
    setDataScorecard(applicationsList.find((application) => application.id === id)?.scorecard[0])
    setDataDeploymentFrequency(applicationsList.find((application) => application.id === id)?.metrics[1].data)
    setDataLeadTimeForChange(applicationsList.find((application) => application.id === id)?.metrics[2].data)
    setDataChangeFailureRate(applicationsList.find((application) => application.id === id)?.metrics[0].data)
    setDataMeanTimeToRecovery(applicationsList.find((application) => application.id === id)?.metrics[3].data)
  }

  return (
    <main className="flex flex-col p-16 pt-0 min-[1921px]:px-64">
      <div className="flex items-center justify-between gap-2 py-16">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-8 h-8" />
          <h1 className="font-bold text-2xl text-foreground">{activeApp} Dashboard</h1>
        </div>

        <div className="flex justify-end items-center gap-4">
          <AppSelector appList={appList} activeApp={activeApp} setActiveApp={setActiveApp} />
          <ApplicationSelector applications={applicationsList} activeApplication={activeApplication} changeActiveApplication={changeActiveApplication} />
          <DateRangeSelector activeDateRange={activeDateRange} setActiveDateRange={setActiveDateRange} />
        </div>
      </div>


      <Card className="flex flex-col min-h-64">
        <CardHeader>
          <CardTitle className="dark:text-white">Software delivery performance</CardTitle>
          <CardDescription>Summary of how your application is performing</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-6 w-full h-full items-center justify-between">
          <div className="h-full p-6 bg-blue-500 rounded-xl dark:bg-blue-500 text-white">
            <div className="relative w-full h-full"><ScorecardScore data={dataScorecard} /></div>
          </div>
          <div className="h-full p-6 bg-blue-50 rounded-xl dark:bg-blue-950/50"><ScorecardTrend data={dataScorecard} /></div>
          <div className="flex items-center h-full p-6 col-span-2 bg-neutral-50 rounded-xl dark:bg-neutral-900"><ScorecardAnalysis data={dataScorecard} /></div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="dark:text-white">DORA metrics</CardTitle>
          <CardDescription>Key metrics that impact software delivery performance</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="dora-ltfc" className="">
            <TabsList className="justify-start w-full h-fit p-0 rounded-none">
              <TabsTrigger value="dora-ltfc" className="flex flex-col items-start w-full p-6 bg-neutral-50 border-0 border-l border-b border-t-2 border-t-transparent rounded-none dark:bg-neutral-900 data-[state=active]:bg-white data-[state=active]:border-b-transparent data-[state=active]:border-t-violet-500 data-[state=active]:shadow-none data-[state=active]:dark:bg-card">
                <LeadTimeForChangeTabTrigger dateRange={activeDateRange} data={dataLeadTimeForChange} appName={activeApp} />
              </TabsTrigger>
              <TabsTrigger value="dora-df" className="flex flex-col items-start w-full p-6 bg-neutral-50 border-0 border-b border-t-2 border-t-transparent rounded-none dark:bg-neutral-900 data-[state=active]:bg-white data-[state=active]:border-b-transparent data-[state=active]:border-t-blue-500 data-[state=active]:shadow-none data-[state=active]:dark:bg-card">
                <DeploymentFrequencyTabTrigger dateRange={activeDateRange} data={dataDeploymentFrequency} appName={activeApp} />
              </TabsTrigger>
              <TabsTrigger value="dora-mttr" className="flex flex-col items-start w-full p-6 bg-neutral-50 border-0 border-l border-b border-t-2 border-t-transparent rounded-none dark:bg-neutral-900 data-[state=active]:bg-white data-[state=active]:border-b-transparent data-[state=active]:border-t-emerald-500 data-[state=active]:shadow-none data-[state=active]:dark:bg-card">
                <MeanTimeToRecoveryTabTrigger dateRange={activeDateRange} data={dataMeanTimeToRecovery} appName={activeApp} />
              </TabsTrigger>
              <TabsTrigger value="dora-cfr" className="flex flex-col items-start w-full p-6 bg-neutral-50 border-0 border-l border-b border-t-2 border-t-transparent rounded-none dark:bg-neutral-900 data-[state=active]:bg-white data-[state=active]:border-b-transparent data-[state=active]:border-t-rose-500 data-[state=active]:shadow-none data-[state=active]:dark:bg-card">
                <ChangeFailureRateTabTrigger dateRange={activeDateRange} data={dataChangeFailureRate} appName={activeApp} />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="dora-df" className="p-6 mt-8">
              <div className="h-64">
                <DeploymentFrequencyChart dateRange={activeDateRange} appName={activeApp} />
              </div>
              <div className="mt-8">
                <h2 className="flex items-center gap-2 mb-4 font-semibold dark:text-white">
                  <TableIcon />
                  Deployments
                </h2>
                <DeploymentFrequencyTable dateRange={activeDateRange} appName={activeApp} />
              </div>
            </TabsContent>
            <TabsContent value="dora-ltfc" className="p-6 mt-8">
              <div className="h-64">
                <LeadTimeForChangeChart dateRange={activeDateRange} appName={activeApp} />
              </div>
              <div className="mt-8">
                <h2 className="flex items-center gap-2 mb-4 font-semibold dark:text-white">
                  <TableIcon />
                  Pull requests
                </h2>
                <LeadTimeForChangeTable dateRange={activeDateRange} appName={activeApp} />
              </div>
            </TabsContent>
            <TabsContent value="dora-cfr" className="p-6 mt-8">
              <div className="h-64">
                <IsolatedChangeFailureRateChart data={dataChangeFailureRate} />
              </div>
              <div className="mt-8">
                <h2 className="flex items-center gap-2 mb-4 font-semibold dark:text-white">
                  <TableIcon />
                  Failed deployments
                </h2>
                <ChangeFailureRateTable />
              </div>
            </TabsContent>
            <TabsContent value="dora-mttr" className="p-6 mt-8">
              <div className="h-64">
                <MeanTimeToRecoveryChart dateRange={activeDateRange} appName={activeApp} />
              </div>
              <div className="mt-8">
                <h2 className="flex items-center gap-2 mb-4 font-semibold dark:text-white">
                  <TableIcon />
                  Pull requests
                </h2>
                <MeanTimeToRecoveryTable dateRange={activeDateRange} appName={activeApp} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}