import type { VAT_TYPE } from "#imports";


export interface Supplier {
    id: string;
    name: string;
    contact: string;
    address: string;
    tin_no: string;
    is_vat_registered: boolean;
}


export interface CreateSupplierInput {
    name: string;
    contact: string;
    address: string;
    tin_no: string;
    is_vat_registered: boolean;
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Supplier
}