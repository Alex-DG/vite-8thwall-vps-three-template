export const initVPSPipelineModule = () => {
  let spotMesh = null

  const handleMeshUpdate = ({ detail }) => {
    if (spotMesh) {
      const { position, rotation } = detail
      spotMesh.position.copy(position)
      spotMesh.quaternion.copy(rotation)
    }
  }

  const handleMeshFound = ({ detail }) => {
    console.log('📍 Spot found')

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

    scene.add(spotMesh)

    handleMeshUpdate({ detail })
  }

  return {
    name: 'init-vps',

    listeners: [
      { event: 'threejsrenderer.meshupdated', process: handleMeshUpdate },
      { event: 'threejsrenderer.meshfound', process: handleMeshFound },
    ],
  }
}
