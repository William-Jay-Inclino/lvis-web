import type { VAT_TYPE } from "#imports";


export interface Supplier {
    id: string;
    name: string;
    contact: string;
    address: string;
    vat_type: VAT_TYPE;
    tin_no: string;
}


export interface CreateSupplierInput {
    name: string;
    contact: string;
    address: string;
    tin_no: string;
    vat_type: VAT_TYPE;
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Supplier
}