import type { Item } from '~/composables/common.types'

export interface CanvassItem {
    id: string
    canvass_id: string
    brand: Brand | null
    unit: Unit | null
    item: Item | null
    description: string
    quantity: number

    // these fields are used in forms
    hasAwardedSupplier?: boolean
}


export interface CreateCanvassItemInput {
    canvass_id: string
    description: string
    brand: Brand | null
    unit: Unit | null
    item: Item | null
    quantity: number
}


export interface UpdateCanvassItemInput {
    description: string
    brand: Brand | null
    unit: Unit | null
    item: Item | null
    quantity: number
}


export interface MutationResponse {
    success: boolean
    msg: string
    data?: CanvassItem
}