import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Payload CMS Project baseline for custom Figma design implementation.',
  title: 'Payload CMS Baseline Project',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col antialiased">
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  )
}
