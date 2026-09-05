import React from 'react'
import Header from '@/components/Header'
import './styles.css'

export const metadata = {
  description: 'The Brink Agency website built with Payload CMS, Next.js, TypeScript, and Tailwind CSS.',
  title: 'The Brink Agency',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  )
}
