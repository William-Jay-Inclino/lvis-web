

export interface ItemBrand {
    id: string;
    name: string;
}


export interface CreateItemBrandInput {
    name: string
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: ItemBrand
}