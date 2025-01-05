import { BoardContainer } from '@/components/board/board-container'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: `Game@${process.env.version}`,
}

export default function Home() {
  return <BoardContainer />
}
