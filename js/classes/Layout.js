import AppEventEmitter from './AppEventEmitter'

class _Layout {
  handleRecenter() {
    this.recenterBtn.classList.add('active-btn')

    setTimeout(() => {
      XR8.XrController.recenter()
      this.recenterBtn.classList.remove('active-btn')
    }, 250)
  }

  toggleVPSScanning(value) {
    if (!value) {
      this.scanningVPS.style.display = 'flex'
    } else {
      this.scanningVPS.style.display = 'none'
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////

  setRecenterBtn() {
    this.recenterBtn = document.getElementById('recenter-btn')
    this.recenterBtn.style.opacity = '1'
    this.recenterBtn.addEventListener('click', this.handleRecenter)
    this.recenterBtn.innerHTML = `<img src="/recenter.png" alt="recenter" />`
  }

  setUpdatingRecenter() {
    this.scanningVPS = document.getElementById('scanning-vps-container')
    this.scanningVPS.innerHTML = `
        <span>Scanning VPS...⏳</span>
        <span>Please, point your device towards</span>
        <span>the wayspot location</span>
    `
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////

  bind() {
    this.toggleVPSScanning = this.toggleVPSScanning.bind(this)
    this.handleRecenter = this.handleRecenter.bind(this)
  }

  init() {
    this.bind()

    AppEventEmitter.on('vpsmesh:found', this.toggleVPSScanning)

    this.setRecenterBtn()
    this.setUpdatingRecenter()
  }
}
const Layout = new _Layout()
export default Layout
