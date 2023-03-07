export const initXRScenePipelineModule = () => {
  const initXrScene = ({ camera }) => {
    camera.position.set(0, 3, 0)
  }

  return {
    name: 'init-xr-scene',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    onStart: ({ canvas }) => {
      const { scene, camera, renderer } = XR8.Threejs.xrScene() // Get the 3js scene from XR8.Threejs

      initXrScene({ scene, camera, renderer }) // Add objects set the starting camera position.

      // prevent scroll/pinch gestures on canvas
      canvas.addEventListener('touchmove', (event) => {
        event.preventDefault()
      })

      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR8.XrController.updateCameraProjectionMatrix({
        origin: camera.position,
        facing: camera.quaternion,
      })
    },

    xrScene: () => xrScene,
  }
}
