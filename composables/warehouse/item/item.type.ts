import type { Unit } from "../canvass/canvass.types";
import type { RrItem } from "../rr/rr-item.types";

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

    // set programmatically
    label?: string 
}


export interface FindAllResponse {
    data: Item[]
    totalItems: number
    currentPage: number
    totalPages: number
}