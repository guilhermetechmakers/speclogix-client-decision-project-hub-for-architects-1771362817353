import { useState, useCallback, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ReportDashboard,
  CustomReportBuilder,
  AlertingRules,
  DataExport,
} from '@/components/reports-analytics'
import { useReportDashboardStats } from '@/hooks/use-reports-analytics'
import { LayoutDashboard, Wrench, Bell, FileDown } from 'lucide-react'

export default function ReportsAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { data: stats, isLoading: statsLoading, isError: statsError } = useReportDashboardStats()

  const handleExportFromDataExport = useCallback(() => {
    setActiveTab('builder')
  }, [])

  useEffect(() => {
    document.title = 'Reports & Analytics | SpecLogix'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Pre-built and custom reports for approvals, RFIs, delays, and workload with CSV/PDF export and scheduled delivery. SpecLogix.'
      )
    }
    return () => {
      document.title = 'SpecLogix'
    }
  }, [])

  return (
    <div className="space-y-6 animate-fade-in [@media(prefers-reduced-motion:reduce)]:animate-none">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Reports & Analytics
        </h1>
        <p className="mt-1 text-muted-foreground">
          Pre-built and custom reports for approvals, RFIs, delays, and workload with CSV/PDF export and scheduled delivery.
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-1 rounded-xl bg-muted p-1 sm:grid-cols-4">
          <TabsTrigger value="dashboard" className="gap-2 rounded-lg">
            <LayoutDashboard className="h-4 w-4" aria-hidden />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="builder" className="gap-2 rounded-lg">
            <Wrench className="h-4 w-4" aria-hidden />
            Custom builder
          </TabsTrigger>
          <TabsTrigger value="alerts" className="gap-2 rounded-lg">
            <Bell className="h-4 w-4" aria-hidden />
            Alerting rules
          </TabsTrigger>
          <TabsTrigger value="export" className="gap-2 rounded-lg">
            <FileDown className="h-4 w-4" aria-hidden />
            Data export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <ReportDashboard
            stats={stats}
            isLoading={statsLoading}
            isError={statsError}
          />
        </TabsContent>

        <TabsContent value="builder" className="mt-6">
          <CustomReportBuilder projectOptions={[]} />
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <AlertingRules />
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <DataExport
            onExportCsv={handleExportFromDataExport}
            onExportPdf={handleExportFromDataExport}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
