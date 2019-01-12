import {
  Pixels,
  ComputedOptions
} from '../../typing'

import { Swatch } from '../../color'

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
  payload: Swatch[]
}

export interface WorkerErrorResponse {
  id: number
  type: 'error'
  payload: string
}

