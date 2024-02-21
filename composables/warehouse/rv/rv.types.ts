import type { Canvass, Classification, Employee } from "../canvass/canvass.types";

export interface RV {
  
  id: string;

  canvass_id: string;

  canvass: Canvass;

  classification_id: string | null;
  classification: Classification | null;

  supervisor_id: string;

  supervisor: Employee

  canceller_id: string | null;

  rv_number: string;

  date_requested: string;

  work_order_no: string;
  
  work_order_date: string;

  notes: string;

  status: number

  rv_approvers: RVApprover[]
  
}

export interface RVApprover {
  id: string 
  approver_id: string 
  approver: Employee | null
  date_approval: string | null
  notes: string 
  status: APPROVAL_STATUS,
  label: string
  order: number
}

export enum APPROVAL_STATUS {
  PENDING = 1,
  APPROVED = 2,
  DISAPPROVED = 3,
  CANCELLED = 4,
}

export interface FindAllResponse {
  data: RV[]
  totalItems: number
  currentPage: number
  totalPages: number
}


export interface MutationResponse {
  success: boolean 
  msg: string 
  data?: RV
}

export interface RvApproverMutationResponse {
  success: boolean 
  msg: string 
  data?: RVApprover
}

export interface UpdateApproverOrderResponse {
  success: boolean;
  msg: string;
  approvers: RVApprover[];
}


export interface CreateRvInput {
  canvass: Canvass | null;
  supervisor: Employee | null;
  date_requested: string;
  work_order_no: string;
  work_order_date: string | null;
  classification: Classification | null;
  notes: string;
  approvers: RvApproverSettings[];
}

export interface UpdateRvInput {
  supervisor: Employee | null;
  classification: Classification | null;
  work_order_no: string;
  work_order_date: string | null;
  notes: string;
}


export interface RvApproverSettings {
  approver_id: string,
  approver: Employee | null
  approver_proxy_id?: string | null
  approver_proxy?: Employee | null
  label: string
  order: number
}

export interface CreateRvApproverInput {
  rv_id: string
  approver: Employee | null  
  label: string 
  order: number
}