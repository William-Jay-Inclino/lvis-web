import type { Brand, Unit } from "../canvass/canvass.types"
import { ITEM_CLASS, VAT_TYPE } from '~/composables/common.types'

export interface RrItem {
	id: string
	item: Item | null
	item_brand: Brand | null
	unit: Unit | null
	item_class: ITEM_CLASS
	quantity_delivered: number
	quantity_accepted: number
	description: string
	vat: {
        value: VAT_TYPE,
        label: string
    }
	gross_price: number
	// net_price: number
	// vat_amount: number
  }