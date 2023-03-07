export const initVPSPipelineModule = () => {
  let mesh = null

  const handleMeshUpdate = ({ detail }) => {
    if (mesh) {
      const { position, rotation } = detail
      mesh.position.copy(position)
      mesh.quaternion.copy(rotation)
    }
  }

  const handleMeshFound = ({ detail }) => {
    console.log('📍 Spot found', { detail })

    const { bufferGeometry } = detail
    const { scene } = XR8.Threejs.xrScene()

    const mat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      wireframe: true,
    })

    mesh = new THREE.Mesh(bufferGeometry, mat)
    mesh.name = 'wayspot-mesh'
    mesh.geometry.computeVertexNormals()
    mesh.geometry.computeBoundingBox()

    scene.add(mesh)

   handleMeshUpdate({ detail })
  }

  const handleMeshLost = () => {
    console.log('handleMeshLost')
  }

  return {
    name: 'vps',

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
