import {
  Pixels,
  ComputedOptions
} from '../../typing'

import { Vec3 } from '../../color'

export interface WorkerRequest {
  id: number
  payload: {
    pixels: Pixels,
    opts: ComputedOptions
  }
}

export interface WorkerResponse {
  id: number
  type: 'return'
  payload: {
    rgb: Vec3,
    population: number
  }[]
}

export interface WorkerErrorResponse {
  id: number
  type: 'error'
  payload: string
}

