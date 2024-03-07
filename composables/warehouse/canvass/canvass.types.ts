import type { Employee } from "~/composables/common.types";
import type { CanvassItem } from "./canvass-item.types"
import type { RV } from "../rv/rv.types";


export interface Canvass {
    id: string;
    rc_number: string;
    date_requested: string;
    purpose: string;
    notes: string;
    requested_by_id: string;
    requested_by: Employee | null;
    is_referenced: boolean;
    disabled: boolean
    canvass_items: CanvassItem[]
    rv?: RV

    created_by: string
    is_deleted: boolean
}

export interface CreateCanvassInput {
    purpose: string
    notes: string
    requested_by: Employee | null
    canvass_items: CreateCanvassItemSubInput[]
}

export interface UpdateCanvassInput {
    purpose: string
    notes: string
    requested_by: Employee | null
}

export interface CreateCanvassItemSubInput {
    description: string
    brand: Brand | null
    unit: Unit | null
    quantity: number
}


export interface FindAllResponse {
    data: Canvass[]
    totalItems: number
    currentPage: number
    totalPages: number
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Canvass
}


export interface Brand {
    id: string
    name: string
}

export interface Unit {
    id: string
    name: string
}

export interface Classification {
    id: string
    name: string
}