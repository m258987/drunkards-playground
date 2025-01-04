import { BoardContainer } from '@/components/board/board-container'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: "Drunkard's playgorund",
  description: "Drunkard's playground game by Faslin Kosta",
  applicationName: "Drunkard's playgorund",
  appleWebApp: true,
  creator: 'Faslin Kosta',
  authors: [
    { name: 'Faslin Kosta', url: 'https://faslin-kosta.com' },
    // todo fix
    { name: 'Tedy Kosta', url: 'https://faslin-kosta.com' },
  ],
  generator: 'Faslin Kosta Board and Imagination',
}

export default function Home() {
  return <BoardContainer />
}
