import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  FileText,
  MessageSquare,
  Calendar,
  LayoutTemplate,
  CheckSquare,
  PenTool,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  User,
} from 'lucide-react'

const SIDEBAR_COLLAPSED_KEY = 'speclogix-sidebar-collapsed'

const mainNav = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { to: '/dashboard/decisions', label: 'Decision Log', icon: ClipboardList },
  { to: '/dashboard/files', label: 'Files & Drawings', icon: FileText },
  { to: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { to: '/dashboard/meetings', label: 'Meetings & Agendas', icon: Calendar },
  { to: '/dashboard/templates', label: 'Templates', icon: LayoutTemplate },
  { to: '/dashboard/tasks', label: 'Tasks & RFIs', icon: CheckSquare },
  { to: '/dashboard/approvals', label: 'Approvals & E-sign', icon: PenTool },
  { to: '/dashboard/reports', label: 'Reports & Analytics', icon: BarChart3 },
]

const bottomNav = [
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  { to: '/help', label: 'Help & Support', icon: HelpCircle },
]

export function DashboardLayout() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed))
    } catch {
      // ignore
    }
  }, [collapsed])

  const isActive = (to: string) => {
    if (to === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(to)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col border-r border-border bg-card transition-[width] duration-300 ease-in-out z-40',
          collapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b border-border px-3">
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-primary">
              <span className="text-xl">SpecLogix</span>
            </Link>
          )}
        </div>
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {mainNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive(item.to)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
        <Separator />
        <div className="space-y-1 p-2">
          {bottomNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive(item.to)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            size="icon"
            className="w-full justify-center"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-border bg-card transition-transform duration-300 ease-in-out lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link to="/dashboard" className="font-semibold text-primary">
            SpecLogix
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {mainNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive(item.to)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <Separator />
        <div className="space-y-1 p-2">
          {bottomNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive(item.to)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-border bg-background/95 px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <Link to="/dashboard/profile">
            <Button variant="ghost" size="icon" aria-label="Profile">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
