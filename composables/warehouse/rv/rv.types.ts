import type { APPROVAL_STATUS } from "~/composables/common.types";
import type { Canvass, Classification } from "../canvass/canvass.types";
import type { RVApprover, RvApproverSettings } from "./rv-approver.types";

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
  rv_approvers: RVApprover[]
  is_cancelled: boolean
  is_deleted: boolean

  // set programmatically

  status: {
    value: APPROVAL_STATUS
    label: string 
    color: string 
  }

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


