import { APPROVAL_STATUS } from "#imports" 

export interface RrApproverSettings {
    approver_id: string,
    approver: Employee | null
    approver_proxy_id?: string | null
    approver_proxy?: Employee | null
    label: string
    order: number
  }

  export interface RrApproverMutationResponse {
    success: boolean 
    msg: string 
    data?: RRApprover
  }
  
  export interface UpdateApproverOrderResponse {
    success: boolean;
    msg: string;
    approvers: RRApprover[];
  }

  export interface RRApprover {
    id: string 
    approver_id: string 
    approver: Employee | null
    date_approval: string | null
    notes: string 
    status: APPROVAL_STATUS,
    label: string
    order: number
  }