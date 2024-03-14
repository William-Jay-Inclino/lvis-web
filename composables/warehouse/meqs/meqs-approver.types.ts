import { APPROVAL_STATUS } from "#imports"

export interface MeqsApproverSettings {
  approver_id: string,
  approver: Employee | null
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

export interface MeqsApproverMutationResponse {
  success: boolean
  msg: string
  data?: MEQSApprover
}

export interface UpdateApproverOrderResponse {
  success: boolean;
  msg: string;
  approvers: MEQSApprover[];
}

export interface MEQSApprover {
  id: string
  approver_id: string
  approver: Employee | null
  date_approval: string | null
  notes: string
  status: APPROVAL_STATUS,
  label: string
  order: number
}