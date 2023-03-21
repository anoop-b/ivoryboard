import './globals.css'

export const metadata = {
  title: 'Whiteboard App',
  description: 'Whiteboarding using NATS and WebSockets',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
