
if (!window.alt) {
  window.alt = {
    emit(eventName: string, ...args: any[]) {
      console.log(`[altv-vue] Event emitted: ${eventName}`, args)
    },
    on(eventName: string, ...args: any[]) {
      console.log(`[altv-vue] Event received: ${eventName}`, args)
    },
    off(eventName: string, ...args: any[]) {
      console.log(`[altv-vue] Event removed: ${eventName}`, args)
    },
    once(eventName: string, ...args: any[]) {
      console.log(`[altv-vue] Event received once: ${eventName}`, args)
    },
    getEventListeners(eventName: string): ((...args: any[]) => void)[] {
      console.log(`[altv-vue] Event listeners: ${eventName}`)
      return [];
    },
    getVersion(): string {
      return "15.0"
    },
    getBranch(): string {
      return "release"
    },
    getLocale(): string {
      return "en"
    },
  }
}