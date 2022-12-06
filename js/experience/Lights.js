class _Lights {
  setLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    this.scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
    this.scene.add(directionalLight)
  }

  init(options) {
    this.scene = options.scene
    this.setLights()
  }
}

const Lights = new _Lights()
export default Lights
