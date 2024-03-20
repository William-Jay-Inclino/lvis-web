import { APPROVAL_STATUS } from "#imports"

export interface JoApproverSettings {
  approver_id: string,
  approver: Employee | null
  label: string
  order: number
}

export interface JoApproverMutationResponse {
  success: boolean
  msg: string
  data?: JOApprover
}

export interface UpdateApproverOrderResponse {
  success: boolean;
  msg: string;
  approvers: JOApprover[];
}

export interface JOApprover {
  id: string
  approver_id: string
  approver: Employee | null
  date_approval: string | null
  notes: string
  status: APPROVAL_STATUS,
  label: string
  order: number
}