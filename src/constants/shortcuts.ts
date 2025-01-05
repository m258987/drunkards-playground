import { IS_APPLE } from './environment'

export const SHORTCUTS = {
  SAVE: IS_APPLE ? '⌘+S' : 'Ctrl+S',
  RESTART: IS_APPLE ? '⌘+R' : 'Ctrl+R',
  LEADERBOARD: 'L',
  MENU: IS_APPLE ? '⌘+M' : 'Ctrl+M',
  AUTOPLAY: IS_APPLE ? '⌘+A' : 'Ctrl+A',
  ROLL_DICE: 'Space',
} as const

export function getShorcutString<Key extends keyof typeof SHORTCUTS>(
  key: Key
): `(${(typeof SHORTCUTS)[Key]})` {
  return `(${SHORTCUTS[key]})`
}
