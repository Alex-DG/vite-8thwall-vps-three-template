import Lights from '../experience/Lights'

/**
 * Initialise 3D world content
 */
export const initWorldPipelineModule = () => {
  const init = () => {
    const { scene } = XR8.Threejs.xrScene()

    Lights.init({ scene })
  }

  const update = () => {}

  return {
    name: 'init-world',

    onStart: () => init(),

    onUpdate: () => update(),
  }
}
