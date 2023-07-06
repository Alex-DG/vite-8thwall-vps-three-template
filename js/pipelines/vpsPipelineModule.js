import AppEventEmitter from '../classes/AppEventEmitter'

export const initVPSPipelineModule = () => {
  let mesh = null
  let wayspotWatcher_ = null
  let gotAllWayspotsTimeout_ = 0 // Records the time between getting each Wayspot from the wayspotWatcher.

  const foundProjectWayspots_ = []
  const nearbyWayspots_ = []

  ////////////////////////////////////////////////////////////////////////////////////////////////////

  const onWayspotVisible = (wayspot) => {
    nearbyWayspots_.push(wayspot)

    window.clearTimeout(gotAllWayspotsTimeout_)
    gotAllWayspotsTimeout_ = window.setTimeout(() => {
      // We get the wayspots individually.  If want to only perform an operation
      // after we have gotten all the nearby ones, we could do that here.
      console.log('✅', 'ALL NEARBY WAYSPOTS PULLED')

      console.log({
        nearbyWayspots_,
        total: nearbyWayspots_.length,
      })
    }, 0)
  }

  const onWayspotHidden = (wayspot) => {
    const index = nearbyWayspots_.indexOf(wayspot)

    if (index > -1) {
      foundProjectWayspots_.splice(index, 1)
    }
  }

  const onAttach = (data) => {
    console.log('onAttach ->', { data })

    wayspotWatcher_ = XR8.Vps.makeWayspotWatcher({
      onVisible: onWayspotVisible,
      onHidden: onWayspotHidden,
      pollGps: true,
    })
  }

  const onStart = () => {
    AppEventEmitter.emit('vpsmesh:found', false)
  }

  const onDetach = (data) => {
    console.log('onDetach ->', { data })
    // Cleanup the watcher
    wayspotWatcher_?.dispose()
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////

  const createBufferGeometryFromRawGeometryData = (geometry) => {
    const bufferGeometry = new THREE.BufferGeometry()

    const buffAttrPosition = new THREE.BufferAttribute(
      geometry.attributes.find((attr) => attr.name === 'position').array,
      3
    )
    const buffAttrColor = new THREE.BufferAttribute(
      geometry.attributes.find((attr) => attr.name === 'color').array,
      3
    )

    bufferGeometry.setAttribute('position', buffAttrPosition)
    bufferGeometry.setAttribute('color', buffAttrColor)
    bufferGeometry.setIndex(new THREE.BufferAttribute(geometry.index.array, 1))

    return bufferGeometry
  }

  const defineWayspotPrivacy = (id) => {
    if (nearbyWayspots_?.length > 0) {
      const wayspot = nearbyWayspots_.find(
        (nearbyWayspot) => nearbyWayspot.id === id
      )

      if (wayspot) {
        console.log('[PUBLIC] Wayspot -> ', { wayspot })
      } else {
        console.log('[PRIVATE] Wayspot')
      }
    }
  }

  const handleMeshFound = ({ detail }) => {
    console.log('📍', 'Mesh -> FOUND ', { detail })

    const { scene } = XR8.Threejs.xrScene()

    const { geometry, position, rotation, id } = detail
    defineWayspotPrivacy(id)

    const material = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      wireframe: true,
    })

    const bufferGeometry = createBufferGeometryFromRawGeometryData(geometry)

    mesh = new THREE.Mesh(bufferGeometry, material)
    mesh.name = `${id}`
    mesh.geometry.computeVertexNormals()
    mesh.geometry.computeBoundingBox()
    mesh.position.copy(position)
    mesh.quaternion.copy(rotation)

    scene.add(mesh)

    AppEventEmitter.emit('vpsmesh:found', true)
  }

  const handleMeshUpdate = ({ detail }) => {
    console.log('📍', 'Mesh -> UPDATE ', { detail })

    if (mesh) {
      const { position, rotation } = detail
      mesh.visible = true
      mesh.position.copy(position)
      mesh.quaternion.copy(rotation)
    }
  }

  const handleMeshLost = ({ detail }) => {
    console.log('📍', 'Mesh -> LOST ', { detail })

    if (mesh) {
      AppEventEmitter.emit('vpsmesh:found', false)

      mesh.visible = false
    }
  }

  return {
    name: 'vps',

    onAttach: onAttach,

    onDetach: onDetach,

    onStart: onStart,

    listeners: [
      { event: 'reality.meshfound', process: handleMeshFound },
      { event: 'reality.meshupdated', process: handleMeshUpdate },
      { event: 'reality.meshlost', process: handleMeshLost },
    ],
  }
}
