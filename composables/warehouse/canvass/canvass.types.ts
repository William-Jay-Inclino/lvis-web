import type { Brand, Employee, Unit } from "~/composables/common.types";
import type { CanvassItem } from "./canvass-item.types"
import type { RV } from "../rv/rv.types";
import type { Item } from "../item/item.type";
import type { JO } from "../jo/jo.types";
import type { SPR } from "../spr/spr.types";


export interface Canvass {
    id: string;
    rc_number: string;
    date_requested: string;
    purpose: string;
    notes: string;
    requested_by_id: string;


    // =============== audit fields =============== 

    created_by: string
    updated_by: string
    deleted_by: string
    created_at: Date
    updated_at: Date
    deleted_at: Date


    // =============== derived / resolvers =============== 

    canvass_items: CanvassItem[]
    rv?: RV
    jo?: JO
    spr?: SPR
    requested_by: Employee | null;
    is_referenced: boolean;
    is_reference_in_rr?: boolean
}


export interface CreateCanvassInput {
    purpose: string
    notes: string
    requested_by: Employee | null
    canvass_items: CanvassItem[]
}

export interface UpdateCanvassInput {
    purpose: string
    notes: string
    requested_by: Employee | null
}

export interface CreateCanvassItemSubInput {
    brand: Brand | null
    unit: Unit | null
    item: Item | null
    description: string
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


