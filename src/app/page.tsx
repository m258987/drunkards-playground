import Menu from '@/components/menu/menu'
import MenuProvider from '@/components/menu/menu-provider'
import MenuContainer from '@/components/menu/menu-provider'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Main menu | Drunkard's Playground`,
}

export default function Home() {
  return <Menu />
}
