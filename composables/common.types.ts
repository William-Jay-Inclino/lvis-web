import type { RrItem } from "./warehouse/rr/rr-item.types"
import type { RR } from "./warehouse/rr/rr.types"


export enum USER_STATUS {
    ACTIVE = 1,
    INACTIVE = 2
}

export enum ROLE {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface User {
    id: string
    username: string
    status: USER_STATUS
    role: ROLE
    user_employee?: UserEmployee
}

export interface UserEmployee {
    id: string
    user_id: string
    user: User
    employee_id: string
    employee: Employee
}

export interface AuthUser {
    user: User
    access_token: string
}

export enum APPROVAL_STATUS {
    PENDING = 1,
    APPROVED = 2,
    DISAPPROVED = 3,
    CANCELLED = 4,
}

export enum VAT_TYPE {
    NONE = 1,
    INC = 2,
    EXC = 3
}

export enum ITEM_CLASS {
    STOCK = 1,
    NON_STOCK = 2
}

export enum ITEM_TRANSACTION_TYPE {
    STOCK_IN = 1,
    STOCK_OUT = 2
}

export interface Approver {
    id: string
    approver_id: string
    approver: Employee | null
    date_approval: string | null
    notes: string
    status: APPROVAL_STATUS,
    label: string
    order: number
}

export interface CreateApproverInput {
    approver: Employee | null
    label: string
    order: number
}

export interface UpdateApproverInput {
    id: string
    approver: Employee | null
    date_approval: string | null
    notes: string | null
    status: {
        id: APPROVAL_STATUS,
        label: string
    }
    label: string
    order: number
}



export interface Employee {
    id: string
    firstname: string
    middlename: string
    lastname: string
    fullname?: string
}


export interface Item {
    id: string;
    item_type_id: string;
    unit_id: string;
    code: string;
    name: string;
    description: string;
    total_quantity: number;
    initial_quantity: number;
    item_type: ItemType;
    item_transactions: ItemTransaction[];
    rr_items: RrItem[];
    unit: Unit;
    GWAPrice: number

    // set programmatically
    label?: string
}

export interface ItemType {
    id: string;
    name: string;
}

export interface ItemTransaction {
    id: string;
    item_id: string;
    txn_number: number;
    rr_item_id?: string | null;
    type: ITEM_TRANSACTION_TYPE;
    quantity: number;
    price: number;
    remarks?: string | null;
    item: Item;
    rr_item?: RrItem;

    created_at: Date
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