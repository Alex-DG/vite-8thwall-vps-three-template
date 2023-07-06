import VConsole from 'vconsole' // debug console

const isDebug = () => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const debug = urlParams.get('debug')
  if (debug && debug === 'true') {
    return true
  }
  return false
}

export const initXRScenePipelineModule = () => {
  const enableConsole = isDebug()

  let vConsole = null

  const initXrScene = ({ camera }) => {
    camera.position.set(0, 3, 0)
  }

  return {
    name: 'customxrscene',

    onAttach: () => {
      if (enableConsole) vConsole = new VConsole({ theme: 'dark' })
    },

    onStart: ({ canvas }) => {
      const { scene, camera, renderer } = XR8.Threejs.xrScene() // Get the 3js scene from XR8.Threejs

      initXrScene({ scene, camera, renderer })

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

    onDetach: () => {
      vConsole?.destroy()
    },
  }
}
