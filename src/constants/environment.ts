export const CAN_USE_DOM: boolean =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'

export const IS_APPLE: boolean =
  CAN_USE_DOM && /Mac|iPod|iPhone|iPad/.test(navigator.platform)

export const IS_FIREFOX: boolean =
  CAN_USE_DOM && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent)

export const IS_SAFARI: boolean =
  CAN_USE_DOM && /Version\/[\d.]+.*Safari/.test(navigator.userAgent)

export const IS_IOS: boolean =
  CAN_USE_DOM &&
  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  // @ts-expect-error gives any vibes
  !window.MSStream

export const IS_ANDROID: boolean =
  CAN_USE_DOM && /Android/.test(navigator.userAgent)

// Keep these in case we need to use them in the future.
// export const IS_WINDOWS: boolean = CAN_USE_DOM && /Win/.test(navigator.platform);
export const IS_CHROME: boolean =
  CAN_USE_DOM && /^(?=.*Chrome).*/i.test(navigator.userAgent)
// export const canUseTextInputEvent: boolean = CAN_USE_DOM && 'TextEvent' in window && !documentMode;

export const IS_ANDROID_CHROME: boolean = CAN_USE_DOM && IS_ANDROID && IS_CHROME

export const IS_APPLE_WEBKIT =
  CAN_USE_DOM && /AppleWebKit\/[\d.]+/.test(navigator.userAgent) && !IS_CHROME
