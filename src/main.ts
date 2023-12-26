import './style.scss'
import { Engine } from './engine/Engine'
import { Demo } from './demo/Demo'
import { Forest } from './forest/Forest'

new Engine({
  canvas: document.querySelector('#canvas') as HTMLCanvasElement,
  experience: Forest,
  info: {
    // twitter: 'https://twitter.com/maya_ndljk',
    // github: 'https://github.com/mayacoda/simple-threejs-typescript-starter',
    // description: 'A simple Three.js + Typescript + Vite starter project',
    documentTitle: 'Forest simulator',
    // title: 'Forest simulator',
  },
})
