

export enum USER_STATUS {
    ACTIVE = 1,
    INACTIVE = 2
}


export interface AuthUser {
    user: {
        id: string
        username: string 
        status: USER_STATUS
    }
    access_token: string
}