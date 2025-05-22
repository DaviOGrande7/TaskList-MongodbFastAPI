// tasklist-mongodb/src/app/layout.tsx

import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Sidebar from "@/components/ui/sidebar"
import { Toaster } from "sonner"
import { TasksProvider } from "@/contexts/TaskProvider"
import { TagsProvider } from "@/contexts/TagsProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Manage tasks efficiently",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <TasksProvider>
        <TagsProvider>
          <body className={inter.className}>
              <Sidebar />
                <main className="ml-16 p-6">
                  {children}
                </main>
              <Toaster />
          </body>
        </TagsProvider>
      </TasksProvider>
    </html>
  )
}
