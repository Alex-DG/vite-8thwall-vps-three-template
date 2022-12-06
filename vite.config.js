// vite.config.js
import basicSsl from '@vitejs/plugin-basic-ssl'
import glsl from 'vite-plugin-glsl'

export default {
  plugins: [glsl(), basicSsl()],
  assetsInclude: [
    '**/*.glb',
    '**/*.gltf',
    '**/*.fbx',
    '**/*.mp4',
    '**/*.webp',
    '**/*.png',
    '**/*.jpg',
  ],
}
