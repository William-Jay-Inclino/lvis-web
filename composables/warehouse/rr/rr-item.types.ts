import type { RR } from "./rr.types"
import type { MeqsSupplierItem } from '../meqs/meqs-supplier-item'

export interface RrItem {
	id: string
	rr_id: string
	meqs_supplier_item_id: string
	quantity_accepted: number

	// =============== derived / resolvers =============== 

	meqs_supplier_item: MeqsSupplierItem
	isInvalidQtyAccepted: boolean
	rr?: RR

}


export interface UpdateRrItemsInput {
	id: string
	quantity_accepted: number
}



export interface UpdateRrItemsResponse {
	success: boolean
	msg: string
	// data: RrItem[]
}