

export interface Unit {
    id: string 
    name: string 
}

export interface FindAllResponse {
    data: Unit[]
    totalItems: number
    currentPage: number
    totalPages: number
}

export interface CreateUnitInput {
    name: string
}

export interface MutationResponse {
    success: boolean 
    msg: string 
    data?: Unit
}