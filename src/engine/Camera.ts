import { Engine } from './Engine'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MapControls } from 'three/examples/jsm/controls/MapControls'
import { GameEntity } from './GameEntity'

export class Camera implements GameEntity {
  public instance!: THREE.PerspectiveCamera
  private controls!: OrbitControls

  constructor(private engine: Engine) {
    this.initCamera()
    this.initControls()
  }

  private initCamera() {
    this.instance = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.instance.position.z = 100
    this.instance.position.y = 0
    this.engine.scene.add(this.instance)
  }
  
  private initControls() {
    this.controls = new MapControls(this.instance, this.engine.canvas)
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 200;
    this.controls.maxDistance = 500;
    this.controls.maxPolarAngle = Math.PI / 2;

    // this.controls.target.set(0,0,0)
    this.instance.position.set(0, 20, -20)
    this.controls.update()
  }
  
  resize() {
    this.instance.aspect = this.engine.sizes.aspectRatio
    this.instance.updateProjectionMatrix()
  }
  
  update() {
    this.controls.update()
    console.log(this.instance.rotation)
    // this.instance.setRotationFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI/6)
    // this.instance.rotation.setFromVector3(new THREE.Vector3(Math.PI/3,0,0))
  }
}
