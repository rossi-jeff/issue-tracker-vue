export class FlashHandler {
  timer = null
  seconds = 6
  store = {
    dispatch() {}
  }

  constructor() {}

  setStore(_store) {
    this.store = _store
  }

  success(message) {
    this.store.dispatch('alert/success', message)
    this.delayedClear()
  }

  info(message) {
    this.store.dispatch('alert/info', message)
    this.delayedClear()
  }

  error(message) {
    this.store.dispatch('alert/error', message)
    this.delayedClear()
  }

  clear() {
    if (this.timer) clearTimeout(this.timer)
    this.store.dispatch('alert/clear')
  }

  delayedClear() {
    this.timer = setTimeout(() => {
      this.store.dispatch('alert/clear')
    }, this.seconds * 1000)
  }
}