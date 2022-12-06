import '../style.css'

import * as THREE from 'three'

import { initVPSPipelineModule } from './pipelines/vpsPipelineModule'
import { initXRScenePipelineModule } from './pipelines/xrScenePipelineModule'
import { initWorldPipelineModule } from './pipelines/worldPipelineModule'

/**
 * Check Location Permissions at beginning of session
 */
const errorCallback = (error) => {
  if (error.code === error.PERMISSION_DENIED) {
    alert('📍 LOCATION PERMISSIONS DENIED. PLEASE ALLOW AND TRY AGAIN.')
  }
}
navigator.geolocation.getCurrentPosition(() => {}, errorCallback)

/**
 * Load XR
 */
const onxrloaded = () => {
  window.THREE = THREE

  // Initalised custom pipelines
  const xrScenePipeline = initXRScenePipelineModule()
  const worldPipeline = initWorldPipelineModule()
  const VPSPipeline = initVPSPipelineModule()

  XR8.XrController.configure({
    enableVps: true,
  })

  XR8.addCameraPipelineModules([
    // Add camera pipeline modules.

    XR8.GlTextureRenderer.pipelineModule(), // Draws the camera feed.

    XR8.Threejs.pipelineModule(), // Creates a ThreeJS AR Scene.

    XR8.XrController.pipelineModule(), // Enables SLAM tracking.

    XRExtras.AlmostThere.pipelineModule(), // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(), // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(), // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(), // Shows an error image on runtime error.

    xrScenePipeline,
    worldPipeline,
    VPSPipeline,
  ])

  XR8.run({ canvas: document.getElementById('experience') })
}

window.onload = () => {
  window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
}
