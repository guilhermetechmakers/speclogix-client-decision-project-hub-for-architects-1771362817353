import * as React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export type AuthTabValue = 'login' | 'signup'

export interface AuthTabsProps {
  value: AuthTabValue
  onValueChange: (value: AuthTabValue) => void
  loginContent: React.ReactNode
  signupContent: React.ReactNode
  className?: string
}

/** Toggle between Login and Signup with accessible tabs. */
export function AuthTabs({
  value,
  onValueChange,
  loginContent,
  signupContent,
  className,
}: AuthTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onValueChange(v as AuthTabValue)}
      className={cn('w-full', className)}
    >
      <TabsList className="grid w-full grid-cols-2 h-11 rounded-lg bg-muted/80 p-1">
        <TabsTrigger
          value="login"
          className="rounded-md transition-all duration-200 data-[state=active]:shadow-sm data-[state=active]:bg-background hover:scale-[1.02] active:scale-[0.98]"
        >
          Login
        </TabsTrigger>
        <TabsTrigger
          value="signup"
          className="rounded-md transition-all duration-200 data-[state=active]:shadow-sm data-[state=active]:bg-background hover:scale-[1.02] active:scale-[0.98]"
        >
          Sign up
        </TabsTrigger>
      </TabsList>
      <TabsContent value="login" className="mt-4 animate-fade-in focus-visible:outline-none">
        {loginContent}
      </TabsContent>
      <TabsContent value="signup" className="mt-4 animate-fade-in focus-visible:outline-none">
        {signupContent}
      </TabsContent>
    </Tabs>
  )
}
