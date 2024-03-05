import { ITEM_TRANSACTION_TYPE } from '~/composables/warehouse/item/item.enums'
import type { RrItem } from '../rr/rr-item.types';

export interface ItemTransaction {
	id: string;
	item_id: string;
	rr_item_id?: string | null;
	type: ITEM_TRANSACTION_TYPE;
	quantity: number;
	price: number;
	remarks?: string | null;
	item: Item;
	rr_item?: RrItem;
}