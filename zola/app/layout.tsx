import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ChatsProvider } from "@/lib/chat-store/chats/provider"
import { ChatSessionProvider } from "@/lib/chat-store/session/provider"
import { SidebarDefaultEffect } from "@/app/components/layout/sidebar-default-effect"
import { AssistantProvider } from "@/lib/assistant-store/provider"
import { ModeProvider } from "@/lib/mode-store/provider"
import { ScheduleProvider } from "@/lib/schedule-store/provider"
import { UsageProvider } from "@/lib/usage-store/provider"
import { AstryxProvider } from "@/components/astryx-provider"
import { ProjectProvider } from "@/lib/project-store/provider"
import { TemporaryChatProvider } from "@/lib/temporary-chat/provider"
import { WorkspaceProvider } from "@/lib/workspace-store/provider"
import { SettingsProvider } from "@/lib/settings-store/provider"
import { ModelProvider } from "@/lib/model-store/provider"
import { TanstackQueryProvider } from "@/lib/tanstack-query/tanstack-query-provider"
import { UserPreferencesProvider } from "@/lib/user-preference-store/provider"
import { UserProvider } from "@/lib/user-store/provider"
import { getUserProfile } from "@/lib/user/api"
import { ThemeProvider } from "next-themes"
import Script from "next/script"
import { LayoutClient } from "./layout-client"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Meteor AI",
  description: "Meteor AI, by Abstraction. Chat with the best AI models in one place.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isDev = process.env.NODE_ENV === "development"
  const isOfficialDeployment = process.env.ZOLA_OFFICIAL === "true"
  const userProfile = await getUserProfile()

  return (
    <html lang="en" suppressHydrationWarning>
      {isOfficialDeployment ? (
        <Script
          defer
          src="https://assets.onedollarstats.com/stonks.js"
          {...(isDev ? { "data-debug": "meteor-ai.vercel.app" } : {})}
        />
      ) : null}
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        <TanstackQueryProvider>
          <LayoutClient />
          <UserProvider initialUser={userProfile}>
            <ModelProvider>
              <ChatsProvider userId={userProfile?.id}>
                <ChatSessionProvider>
                  <UserPreferencesProvider
                    userId={userProfile?.id}
                    initialPreferences={userProfile?.preferences}
                  >
                    <TooltipProvider
                      delayDuration={200}
                      skipDelayDuration={500}
                    >
                      <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                      >
                        <AstryxProvider>
                        <SettingsProvider>
                          <ModeProvider>
                            <AssistantProvider>
                              <WorkspaceProvider>
                                <ScheduleProvider>
                                  <TemporaryChatProvider>
                                  <ProjectProvider>
                                  <UsageProvider>
                                  <SidebarProvider defaultOpen>
                                    <SidebarDefaultEffect />
                                    <Toaster position="top-center" />
                                    {children}
                                  </SidebarProvider>
                                  </UsageProvider>
                                  </ProjectProvider>
                                  </TemporaryChatProvider>
                                </ScheduleProvider>
                              </WorkspaceProvider>
                            </AssistantProvider>
                          </ModeProvider>
                        </SettingsProvider>
                        </AstryxProvider>
                      </ThemeProvider>
                    </TooltipProvider>
                  </UserPreferencesProvider>
                </ChatSessionProvider>
              </ChatsProvider>
            </ModelProvider>
          </UserProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  )
}
