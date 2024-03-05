import type { Brand } from "../canvass/canvass.types"
import type { PO } from "../po/po.types"
import type { Unit } from "../unit/unit.types"
import type { RrApproverSettings } from "./rr-approver.types"
import type { CreateRrInput, FindAllResponse, MutationResponse, RR, UpdateRrInput } from "./rr.types"


export async function findByRefNumber(payload: { po_number?: string, rr_number?: string }): Promise<RR | undefined> {

    let referenceField = 'rr_number'
    let referenceValue = null

    if(payload.po_number) {
        referenceField = 'po_number'
        referenceValue = payload.po_number
    }else {
        referenceValue = payload.rr_number
    }

    const query = `
        query {
            rr(${referenceField}: "${referenceValue}") {
                id
                rr_number
                status
                rr_date
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
                        }
                    }
                }
                canceller_id
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if(response.data && response.data.data && response.data.data.rr) {
            return response.data.data.rr;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findAll(payload: {page: number, pageSize: number, date_requested: string | null, requested_by_id: string | null}): Promise<FindAllResponse> {
    
    const { page, pageSize, date_requested, requested_by_id } = payload;

    let date_requested2 = null
    let requested_by_id2 = null

    if(date_requested) {
        date_requested2 = `"${date_requested}"`
    } 

    if(requested_by_id) {
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
                    po {
                      id
                      po_number
                      is_cancelled
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
            employees(page: 1, pageSize: 50) {
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

        if(!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if(data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if(data.pos && data.pos.data) { 
            pos = data.pos.data
        }

        if(data.rrs && data.rrs.data) { 
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
                    is_referenced
                    meqs_supplier {
                        id
                        payment_terms
                        is_referenced
                        supplier{
                            id
                            name 
                            vat_type
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
                            }
                        }
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
                approver_proxy_id
                approver_proxy{
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
            units(page: 1, pageSize: 10){
                data {
                    id
                    name
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

        if(!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if(data.pos && data.pos.data) {
            pos = data.pos.data
        }

        if(data.rrApproverSettings) {
            approvers = data.rrApproverSettings
        }

        if(data.brands) { // temp
            brands = data.brands
        }

        if(data.items && data.items.data) {
            items = response.data.data.items.data
        }

        if(data.units && data.units.data) {
            units = response.data.data.units.data
        }

        if(data.employees && data.employees.data) {
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
                is_cancelled
                is_deleted
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
                po {
                    id
                    po_number
                }
            },
            employees(page: 1, pageSize: 50) {
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

        if(!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if(!data.rr) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        if(data.employees && data.employees.data) {
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
                is_deleted
                is_cancelled
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
                    approver_proxy {
                        firstname
                        middlename
                        lastname
                    }
                    status
                    label
                    order
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
                        }
                    }
                }
                rr_items {
                    item {
                        id 
                        code 
                        name
                    }
                    item_brand {
                        id 
                        name
                    }
                    unit {
                        id
                        name
                    }
                    item_class
                    quantity_delivered
                    quantity_accepted
                    description
                    vat_type
                    gross_price
                    net_price
                    vat_amount
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if(response.data && response.data.data && response.data.data.rr) {
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

        let item_brand_id = null 
        let unit_id = null 
        let item_id = null

        if(item.item_brand) {
            item_brand_id = `"${item.item_brand.id}"`
        }

        if(item.unit) {
            unit_id = `"${item.unit.id}"`
        }

        if(item.item) {
            item_id = `"${item.item.id}"`
        }

        return `
        {
          item_id: ${item_id}
          item_brand_id: ${item_brand_id}
          unit_id: ${unit_id}
          item_class: ${item.itemClassObject.value}
          quantity_delivered: ${item.quantity_delivered}
          quantity_accepted: ${item.quantity_accepted}
          description: "${item.description}"
          vat_type: ${item.vat.value}
          gross_price: ${item.gross_price}
          net_price: ${item.net_price}
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

        if(response.data && response.data.data && response.data.data.createRr) {
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

        if(response.data && response.data.data && response.data.data.updateRr) {
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


export async function cancel(id: string): Promise<MutationResponse> {

    const authUserJson = localStorage.getItem('authUser')

    if(!authUserJson) {
        throw console.error('authUser in localstorage not found');
    }

    const authUser = JSON.parse(authUserJson) as AuthUser

    const mutation = `
        mutation {
            updateRr(
                id: "${id}",
                input: {
                    canceller_id: "${authUser.user.id}"
                }
            ) {
                id
                is_cancelled
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if(response.data && response.data.data && response.data.data.updateRr) {
            return {
                success: true,
                msg: 'RR cancelled!' 
            };
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