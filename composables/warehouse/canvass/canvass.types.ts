
export interface Employee {
    id: string
    firstname: string
    middlename: string
    lastname: string
}

export interface Canvass {
    id: string;
  
    rc_number: string;
  
    date_requested: Date;
  
    purpose: string;
  
    notes: string;
  
    requested_by_id: string;
  
    requested_by?: Employee;
  
    // canvass_items: CanvassItem[];
  
    is_referenced: boolean;
  
    // jo?: JO
  
    // rv?: RV
  
    // spr?: SPR
  
    created_at: Date;
  
    updated_at: Date;
}


export interface FindAllResponse {
    data: Canvass[]
    totalItems: number
    currentPage: number
    totalPages: number
}