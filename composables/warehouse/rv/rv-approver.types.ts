import { APPROVAL_STATUS } from "#imports" 

export interface RvApproverSettings {
    approver_id: string,
    approver: Employee | null
    approver_proxy_id?: string | null
    approver_proxy?: Employee | null
    label: string
    order: number
  }
  
  export interface CreateApproverInput {
    approver: Employee
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