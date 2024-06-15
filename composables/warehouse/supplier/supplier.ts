
export interface Supplier {
    id: string;
    name: string;
    contact: string;
    address: string;
    tin_no: string;
    is_vat_registered: boolean;

    // set programmatically 

    name_with_address?: string
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