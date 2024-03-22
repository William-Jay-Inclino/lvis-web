

export interface Employee {
    id: string
    firstname: string
    middlename: string
    lastname: string
}

export interface FindAllResponse {
    data: Employee[]
    totalItems: number
    currentPage: number
    totalPages: number
}

export interface CreateEmployeeInput {
    firstname: string
    middlename: string
    lastname: string
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Employee
}