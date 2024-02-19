import type { Canvass } from "../canvass/canvass.types";

export interface RV {
  
  id: string;

  canvass_id: string;

  canvass: Canvass;

  classification_id: string | null;

  supervisor_id: string;

  canceller_id: string | null;

  rv_number: string;

  date_requested: string;

  work_order_no: string;

  work_order_date: string;

  status: number
  
}


export interface FindAllResponse {
  data: RV[]
  totalItems: number
  currentPage: number
  totalPages: number
}