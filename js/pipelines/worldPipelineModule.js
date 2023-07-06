import Layout from '../classes/Layout'
import Lights from '../classes/Lights'

/**
 * Initialise 3D world content
 */
export const initWorldPipelineModule = () => {
  const init = () => {
    Layout.init()
    Lights.init()

    console.log('✨', 'World ready!')
  }

  const update = () => {}

  return {
    name: 'world',

    onStart: () => init(),

    onUpdate: () => update(),
  }
}
