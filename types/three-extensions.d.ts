import type { Object3DNode } from '@react-three/fiber'
import type { DirectionalLight, AmbientLight, PointLight } from 'three'

declare module '@react-three/fiber' {
  interface ThreeElements {
    directionalLight: Object3DNode<DirectionalLight, typeof DirectionalLight>
    ambientLight: Object3DNode<AmbientLight, typeof AmbientLight>
    pointLight: Object3DNode<PointLight, typeof PointLight>
  }
}
