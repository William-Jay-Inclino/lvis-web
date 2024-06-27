import type { Employee } from "~/composables/system/employee/employee.types"
import type { Item } from "../item/item.type"
import type { PO } from "../po/po.types"
import type { RrApproverSettings } from "./rr-approver.types"
import type { CreateRrInput, FindAllResponse, MutationResponse, RR, UpdateRrInput } from "./rr.types"


export async function findByRefNumber(payload: { po_number?: string, rr_number?: string }): Promise<RR | undefined> {

    let referenceField = 'rr_number'
    let referenceValue = null

    if (payload.po_number) {
        referenceField = 'po_number'
        referenceValue = payload.po_number
    } else {
        referenceValue = payload.rr_number
    }

    const query = `
        query {
            rr(${referenceField}: "${referenceValue}") {
                id
                rr_number
                status
                rr_date
                is_completed
                created_by
                cancelled_at
                can_update
                po {
                    id
                    po_number
                    meqs_supplier {
                        meqs {
                            meqs_number
                            rv {
                                rv_number
                                canvass {
                                    rc_number 
                                    requested_by {
                                        id 
                                        firstname
                                        middlename
                                        lastname
                                    }
                                }
                            }
                            spr {
                                spr_number
                                canvass {
                                    rc_number 
                                    requested_by {
                                        id 
                                        firstname
                                        middlename
                                        lastname
                                    }
                                }
                            }
                            jo {
                                jo_number
                                canvass {
                                    rc_number 
                                    requested_by {
                                        id 
                                        firstname
                                        middlename
                                        lastname
                                    }
                                }
                            }
                        }
                    }
                }
                
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.rr) {
            return response.data.data.rr;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findAll(payload: { page: number, pageSize: number, date_requested: string | null, requested_by_id: string | null }): Promise<FindAllResponse> {

    const { page, pageSize, date_requested, requested_by_id } = payload;

    let date_requested2 = null
    let requested_by_id2 = null

    if (date_requested) {
        date_requested2 = `"${date_requested}"`
    }

    if (requested_by_id) {
        requested_by_id2 = `"${requested_by_id}"`
    }

    const query = `
        query {
            rrs(
                page: ${page},
                pageSize: ${pageSize},
                date_requested: ${date_requested2},
                requested_by_id: ${requested_by_id2},
            ) {
                data {
                    id
                    rr_number
                    status
                    rr_date
                    is_completed
                    created_by
                    can_update
                    cancelled_at
                    po {
                        id
                        po_number
                        cancelled_at
                        meqs_supplier {
                            meqs {
                            meqs_number
                                rv {
                                    rv_number
                                    canvass {
                                        rc_number
                                        requested_by {
                                            id
                                            firstname
                                            middlename
                                            lastname
                                        }
                                    }
                                }
                                spr {
                                    spr_number
                                    canvass {
                                        rc_number
                                        requested_by {
                                            id
                                            firstname
                                            middlename
                                            lastname
                                        }
                                    }
                                }
                                jo {
                                    jo_number
                                    canvass {
                                        rc_number
                                        requested_by {
                                            id
                                            firstname
                                            middlename
                                            lastname
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                totalItems
                currentPage
                totalPages
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return response.data.data.rrs;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function fetchDataInSearchFilters(): Promise<{
    pos: PO[],
    employees: Employee[],
    rrs: RR[],
}> {
    const query = `
        query {
            pos(page: 1, pageSize: 10) {
                data{
                    po_number
                }
            },
            rrs(page: 1, pageSize: 10) {
                data{
                    rr_number
                }
            },
            employees(page: 1, pageSize: 10) {
                data {
                    id
                    firstname
                    middlename
                    lastname
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let pos = []
        let employees = []
        let rrs = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.pos && data.pos.data) {
            pos = data.pos.data
        }

        if (data.rrs && data.rrs.data) {
            rrs = data.rrs.data
        }

        return {
            pos,
            employees,
            rrs,
        }

    } catch (error) {
        console.error(error);
        return {
            pos: [],
            employees: [],
            rrs: [],
        }
    }
}

export async function fetchFormDataInCreate(): Promise<{
    pos: PO[],
    approvers: RrApproverSettings[],
    brands: Brand[],
    units: Unit[],
    employees: Employee[],
    items: Item[]
}> {

    const query = `
        query {
            pos(page: 1, pageSize: 10) {
                data{
                    id
                    po_number
                    status
                    meqs_supplier {
                        id
                        payment_terms
                        is_referenced
                        supplier{
                            id
                            name 
                            is_vat_registered
                        }
                        meqs_supplier_items {
                            id 
                            price 
                            notes 
                            is_awarded
                            vat_type
                            canvass_item {
                                id 
                                description
                                brand {
                                    id 
                                    name
                                }
                                unit {
                                    id 
                                    name 
                                }
                                quantity
                                item {
                                    id 
                                    code 
                                    name 
                                    description
                                }
                            }
                        }
                    }
                    rrs {
                        id 
                        rr_number
                    }
                }
            },
            rrApproverSettings{
                approver_id
                approver{
                  id
                  firstname
                  middlename
                  lastname
                }
                label
                order
            },
            brands{
                id
                name
            },
            units{
                id
                name
            },
            employees(page: 1, pageSize: 10) {
                data {
                    id
                    firstname
                    middlename
                    lastname
                }
            },
            items(page: 1, pageSize: 10) {
                data {
                    id
                    code
                    name
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let pos = []
        let approvers = []
        let brands = []
        let units = []
        let employees = []
        let items = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.pos && data.pos.data) {
            pos = data.pos.data
        }

        if (data.rrApproverSettings) {
            approvers = data.rrApproverSettings
        }

        if (data.brands) { // temp
            brands = data.brands
        }

        if (data.items && data.items.data) {
            items = response.data.data.items.data
        }

        if (data.units && data.units.data) {
            units = response.data.data.units.data
        }

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        return {
            pos,
            approvers,
            brands,
            units,
            employees,
            items,
        }

    } catch (error) {
        console.error(error);
        return {
            pos: [],
            approvers: [],
            brands: [],
            units: [],
            employees: [],
            items: []
        }
    }


}

export async function fetchFormDataInUpdate(id: string): Promise<{
    employees: Employee[],
    rr: RR | undefined
}> {

    const query = `
        query {
            rr(id: "${id}") {
                id 
                rr_number 
                rr_date
                invoice_number
                delivery_number
                notes
                delivery_charge
                created_by
                cancelled_at
                can_update
                received_by {
                    id
                    firstname
                    middlename
                    lastname
                }
                rr_approvers {
                    id
                    approver {
                        id
                        firstname
                        middlename
                        lastname
                    }
                    date_approval 
                    notes
                    status
                    label
                    order
                }
                rr_items {
                    id
                    quantity_accepted
                    meqs_supplier_item {
                        price
                        vat_type
                        canvass_item {
                            brand {
                                id 
                                name
                            }
                            unit {
                                id 
                                name 
                            }
                            description
                            quantity
                            item {
                                id
                                code 
                                name
                                description
                            }
                        }
                    }
                }
                po {
                    id
                    po_number
                }
            },
            employees(page: 1, pageSize: 10) {
                data {
                    id
                    firstname
                    middlename
                    lastname
                }
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees: Employee[] = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (!data.rr) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        return {
            rr: data.rr,
            employees
        }

    } catch (error) {
        console.error(error);
        return {
            rr: undefined,
            employees: []
        }
    }


}

export async function findOne(id: string): Promise<RR | undefined> {
    const query = `
        query {
            rr(id: "${id}") {
                id
                rr_number
                rr_date
                invoice_number
                delivery_number
                notes
                delivery_charge
                status
                is_completed
                created_by
                cancelled_at
                can_update
                received_by {
                    id
                    firstname
                    middlename
                    lastname
                }
                rr_approvers{
                    approver {
                        firstname
                        middlename
                        lastname
                    }
                    status
                    label
                    order
                    notes
                    date_approval
                }
                po {
                    id
                    po_number 
                    meqs_supplier {
                        meqs {
                            id
                            meqs_number
                            rv {
                                id
                                rv_number
                                canvass {
                                    id
                                    rc_number
                                }
                            }
                            spr {
                                id
                                spr_number
                                canvass {
                                    id
                                    rc_number
                                }
                            }
                            jo {
                                id
                                jo_number
                                canvass {
                                    id
                                    rc_number
                                }
                            }
                        }
                    }
                }
                rr_items {
                    id
                    quantity_accepted
                    meqs_supplier_item {
                        price
                        vat_type
                        canvass_item {
                            brand {
                                id 
                                name
                            }
                            unit {
                                id 
                                name 
                            }
                            description
                            quantity
                            item {
                                id
                                code 
                                name
                                description
                            }
                        }
                    }
                    item_transaction {
                        item_id
                    }
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.rr) {
            return response.data.data.rr;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateRrInput): Promise<MutationResponse> {

    const approvers = input.approvers.map(item => {
        return `
        {
          approver_id: "${item.approver?.id}"
          label: "${item.label}"
          order: ${item.order}
        }`;
    }).join(', ');

    const rrItems = input.rr_items.map(item => {

        return `
        {
          quantity_accepted: ${item.quantity_accepted}
          meqs_supplier_item_id: "${item.meqs_supplier_item_id}"
        }`;
    }).join(', ');

    const mutation = `
        mutation {
            createRr(
                input: {
                    po_id: "${input.po?.id}"
                    received_by_id: "${input.received_by?.id}"
                    invoice_number: "${input.invoice_number}"
                    delivery_number: "${input.delivery_number}"
                    notes: "${input.notes}"
                    delivery_charge: ${input.delivery_charge}
                    approvers: [${approvers}]
                    rr_items: [${rrItems}]
                }
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createRr) {
            return {
                success: true,
                msg: 'RR created successfully!',
                data: response.data.data.createRr
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create RR. Please contact system administrator'
        };
    }
}

export async function update(id: string, input: UpdateRrInput): Promise<MutationResponse> {


    const mutation = `
        mutation {
            updateRr(
                id: "${id}",
                input: {
                    received_by_id: "${input.received_by?.id}"
                    invoice_number: "${input.invoice_number}"
                    delivery_number: "${input.delivery_number}"
                    notes: "${input.notes}"
                    delivery_charge: ${input.delivery_charge}
                }
            ) {
                id
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateRr) {
            return {
                success: true,
                msg: 'RR updated successfully!',
                data: response.data.data.updateRr
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update RR. Please contact system administrator'
        };
    }
}

export async function cancel(id: string): Promise<CancelResponse> {

    const mutation = `
        mutation {
            cancelRr(
                id: "${id}"
            ) {
                msg
                success
                cancelled_at
                cancelled_by
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.cancelRr) {
            return response.data.data.cancelRr
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to cancel RR. Please contact system administrator'
        };
    }
}

export async function fetchRrNumbers(payload: string): Promise<RR[]> {
    const query = `
        query {
            rrs_by_rr_number(rr_number: "${payload}") {
                rr_number
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.rrs_by_rr_number

    } catch (error) {
        console.error(error);
        return []
    }
}