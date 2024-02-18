import type { Brand, Unit } from "./canvass.types"



export interface CanvassItem {
    id: string 
    canvass_id: string 
    description: string 
    brand: Brand | null  
    unit: Unit | null 
    quantity: number  
}


export interface CreateCanvassItemInput {
    canvass_id: string
    description: string 
    brand: Brand | null  
    unit: Unit | null 
    quantity: number  
}


export interface UpdateCanvassItemInput {
    description: string 
    brand: Brand | null  
    unit: Unit | null 
    quantity: number  
}


export interface MutationResponse {
    success: boolean 
    msg: string 
    data?: CanvassItem
}