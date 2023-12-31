import { Josefin_Sans } from 'next/font/google'

const josefin = Josefin_Sans({ subsets: ['latin'], weight: '400' })
import { Toaster } from 'react-hot-toast'
import "bootstrap/dist/css/bootstrap.css"
export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}
 
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={josefin.className}>
          {children}
        <Toaster position='bottom-right' />
      </body>
    </html>
  )
}
