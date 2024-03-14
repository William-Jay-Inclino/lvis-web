import type { APPROVAL_STATUS } from "~/composables/common.types";
import type { Canvass } from "../canvass/canvass.types";
import type { RVApprover, RvApproverSettings } from "./rv-approver.types";
import type { MEQS } from "../meqs/meqs.types";

export interface RV {
  id: string;
  rv_number: string;
  canvass_id: string;
  classification_id: string | null;
  supervisor_id: string;
  date_requested: string;
  work_order_no: string;
  work_order_date: string;
  date_cancelled?: Date | null
  notes: string;




  // =============== audit fields =============== 

  cancelled_by: string
  created_by: string
  updated_by: string
  cancelled_at: Date
  created_at: Date
  updated_at: Date



  // =============== derived / resolvers =============== 

  canvass: Canvass;
  meqs?: MEQS
  rv_approvers: RVApprover[]
  status: APPROVAL_STATUS
  classification: Classification | null;
  supervisor: Employee
  is_referenced: boolean;

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
  classification: Classification | null;
  supervisor: Employee | null;
  work_order_no: string;
  work_order_date: string | null;
  notes: string;
  approvers: RvApproverSettings[];
}

export interface UpdateRvInput {
  classification: Classification | null;
  supervisor: Employee | null;
  work_order_no: string;
  work_order_date: string | null;
  notes: string;
}


