import { createBrowserRouter, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { LandingPage } from '@/pages/landing'
import { LoginPage } from '@/pages/login'
import { ForgotPasswordPage } from '@/pages/forgot-password'
import { ClientAccessPage } from '@/pages/client-access'
import { ProfilePage } from '@/pages/profile'
import { DashboardOverviewPage } from '@/pages/dashboard-overview'
import { ProjectsListPage } from '@/pages/projects-list'
import { ProjectOverviewPage } from '@/pages/project-overview'
import { DecisionLogPage } from '@/pages/decision-log'
import { FilesDrawingsPage } from '@/pages/files-drawings'
import { MessagesPage } from '@/pages/messages'
import MeetingsAgendasPage from '@/pages/MeetingsAgendas'
import { TemplatesPage } from '@/pages/templates'
import TemplatesWorkflowLibraryPage from '@/pages/TemplatesWorkflowLibrary'
import { TasksRfisPage } from '@/pages/tasks-rfis'
import ApprovalsESignaturesPage from '@/pages/ApprovalsESignatures'
import { ReportsPage } from '@/pages/reports'
import { AdminDashboardPage } from '@/pages/admin-dashboard'
import { SettingsPage } from '@/pages/settings'
import { PricingPage } from '@/pages/pricing'
import { HelpPage } from '@/pages/help'
import { PrivacyPage } from '@/pages/privacy'
import { TermsPage } from '@/pages/terms'
import { NotFoundPage } from '@/pages/not-found'
import SignupLoginPage from '@/pages/Signup/Login'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/decision-log', element: <Navigate to="/dashboard/decisions" replace /> },
  { path: '/meetings-&-agendas', element: <Navigate to="/dashboard/meetings" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <LoginPage /> },
  { path: '/signup-/-login', element: <SignupLoginPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/client-access', element: <ClientAccessPage /> },
  { path: '/pricing', element: <PricingPage /> },
  { path: '/help', element: <HelpPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  { path: '/terms', element: <TermsPage /> },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardOverviewPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'projects', element: <ProjectsListPage /> },
      { path: 'projects/new', element: <ProjectsListPage /> },
      { path: 'projects/:projectId', element: <ProjectOverviewPage /> },
      { path: 'decisions', element: <DecisionLogPage /> },
      { path: 'decisions/new', element: <DecisionLogPage /> },
      { path: 'decisions/:decisionId', element: <DecisionLogPage /> },
      { path: 'files', element: <FilesDrawingsPage /> },
      { path: 'messages', element: <MessagesPage /> },
      { path: 'meetings', element: <MeetingsAgendasPage /> },
      { path: 'meetings-agendas', element: <MeetingsAgendasPage /> },
      { path: 'templates', element: <TemplatesPage /> },
      { path: 'templates-workflow-library', element: <TemplatesWorkflowLibraryPage /> },
      { path: 'tasks', element: <TasksRfisPage /> },
      { path: 'approvals', element: <ApprovalsESignaturesPage /> },
      { path: 'approvals-e-signatures', element: <ApprovalsESignaturesPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'admin', element: <AdminDashboardPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  { path: '/404', element: <NotFoundPage /> },
  { path: '*', element: <NotFoundPage /> },
])
