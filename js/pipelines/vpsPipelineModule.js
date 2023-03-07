export const initVPSPipelineModule = () => {
  let spotMesh = null

  const handleMeshUpdate = ({ detail }) => {
    console.log('handleMeshUpdate')
    if (spotMesh) {
      const { position, rotation } = detail
      spotMesh.position.copy(position)
      spotMesh.quaternion.copy(rotation)
    }
  }

  const handleMeshFound = ({ detail }) => {
    console.log('📍 Spot found')

    console.log({ detail })
    const { bufferGeometry } = detail
    const { scene } = XR8.Threejs.xrScene()

    const threeMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      wireframe: true,
    })

    spotMesh = new THREE.Mesh(bufferGeometry, threeMaterial)
    spotMesh.name = 'wayspot-mesh'
    spotMesh.geometry.computeVertexNormals()
    spotMesh.geometry.computeBoundingBox()

    console.log({ spotMesh })

    scene.add(spotMesh)

    // handleMeshUpdate({ detail })
    const { position, rotation } = detail
    spotMesh.position.copy(position)
    spotMesh.quaternion.copy(rotation)
  }

  const handleMeshLost = () => {
    console.log('handleMeshLost')
  }

  return {
    name: 'init-vps',

    // Return a BufferGeomtry to recreate the mesh + position + rotation
    listeners: [
      { event: 'threejsrenderer.meshupdated', process: handleMeshUpdate },
      { event: 'threejsrenderer.meshfound', process: handleMeshFound },
    ],

    // Return only a position and a rotation
    // listeners: [
    //   { event: 'reality.projectwayspotfound', process: handleMeshFound },
    //   { event: 'reality.projectwayspotlost', process: handleMeshLost },
    // ],
  }
}
