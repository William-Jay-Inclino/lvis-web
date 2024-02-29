import type { MEQS } from "../meqs/meqs.types";
import type { PoApproverSettings } from "./po-approver.types";
import type { CreatePoInput, FindAllResponse, MutationResponse, PO, UpdatePoInput } from "./po.types";

export async function findByRefNumber(payload: { po_number?: string, meqs_number?: string }): Promise<PO | undefined> {

    let referenceField = 'po_number'
    let referenceValue = null

    if(payload.meqs_number) {
        referenceField = 'meqs_number'
        referenceValue = payload.meqs_number
    }else {
        referenceValue = payload.po_number
    }

    const query = `
        query {
            po(${referenceField}: "${referenceValue}") {
                id
                po_number
                status
                po_date
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
                canceller_id
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if(response.data && response.data.data && response.data.data.po) {
            return response.data.data.po;
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
            pos(
                page: ${page},
                pageSize: ${pageSize},
                date_requested: ${date_requested2},
                requested_by_id: ${requested_by_id2},
            ) {
                data {
                    id
                    po_number
                    status
                    po_date
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
                    canceller_id
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
        return response.data.data.pos;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function fetchDataInSearchFilters(): Promise<{
    pos: PO[],
    employees: Employee[],
    meqs: MEQS[],
}> {
    const query = `
        query {
            pos(page: 1, pageSize: 10) {
                data{
                    po_number
                }
            },
            meqs(page: 1, pageSize: 10) {
                data{
                    meqs_number
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
        let meqs = []

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

        if(data.meqs && data.meqs.data) { 
            meqs = data.meqs.data
        }

        return {
            pos,
            employees,
            meqs,
        }

    } catch (error) {
        console.error(error);
        return {
            pos: [],
            employees: [],
            meqs: [],
        }
    }
}

export async function fetchFormDataInCreate(): Promise<{
    meqs: MEQS[],
    approvers: PoApproverSettings[]
}> {

    const query = `
        query {
            meqs(page: 1, pageSize: 10) {
                data{
                    id
                    meqs_number
                    status
                    meqs_suppliers {
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
            poApproverSettings{
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
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let meqs = []
        let approvers = []

        if(!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if(data.meqs && data.meqs.data) {
            meqs = data.meqs.data
        }

        if(data.poApproverSettings) {
            approvers = data.poApproverSettings
        }

        return {
            meqs,
            approvers
        }

    } catch (error) {
        console.error(error);
        return {
            meqs: [],
            approvers: []
        }
    }
    

}

export async function fetchFormDataInUpdate(id: string): Promise<{
    employees: Employee[],
    po: PO | undefined
}> {

    const query = `
        query {
            po(id: "${id}") {
                id 
                po_number 
                po_date
                is_cancelled
                notes
                meqs_supplier{
                    id
                    supplier {
                        id 
                        name
                        vat_type
                    }
                    meqs {
                        id 
                        meqs_number
                        rv {
                            id
                            rv_number 
                            canvass {
                                rc_number
                                requested_by {
                                    id
                                    firstname
                                    middlename
                                    lastname
                                }
                                purpose
                                notes
                            }
                        }
                    }
                }
                po_approvers {
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

        if(!data.po) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        if(data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        return {
            po: data.po,
            employees
        }

    } catch (error) {
        console.error(error);
        return {
            po: undefined,
            employees: []
        }
    }
    

}

export async function create(input: CreatePoInput): Promise<MutationResponse> {

    const approvers = input.approvers.map(item => {
        return `
        {
          approver_id: "${item.approver?.id}"
          label: "${item.label}"
          order: ${item.order}
        }`;
    }).join(', ');

    const mutation = `
        mutation {
            createPo(
                input: {
                    meqs_supplier_id: "${input.meqs_supplier?.id}"
                    notes: "${input.notes}"
                    approvers: [${approvers}]
                }
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if(response.data && response.data.data && response.data.data.createPo) {
            return {
                success: true,
                msg: 'PO created successfully!',
                data: response.data.data.createPo 
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        
        return {
            success: false,
            msg: 'Failed to create PO. Please contact system administrator'
        };
    }
}

export async function findOne(id: string): Promise<PO | undefined> {
    const query = `
        query {
            po(id: "${id}") {
                id
                po_number
                status
                po_date
                notes
                is_deleted
                canceller{
                    id
                    firstname
                    middlename
                    lastname
                }
                po_approvers{
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
                meqs_supplier {
                    id
                    payment_terms
                    supplier{
                        id
                        name 
                        vat_type
                    }
                    meqs {
                        id
                        meqs_number
                        rv {
                            id
                            rv_number
                            canvass {
                                id
                                rc_number
                                purpose 
                                notes
                                requested_by {
                                    id
                                    firstname
                                    middlename
                                    lastname
                                }
                            }
                        }
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
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if(response.data && response.data.data && response.data.data.po) {
            return response.data.data.po;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function update(id: string, input: UpdatePoInput): Promise<MutationResponse> {

    
    const mutation = `
        mutation {
            updatePo(
                id: "${id}",
                input: {
                    notes: "${input.notes}"
                }
            ) {
                id
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if(response.data && response.data.data && response.data.data.updatePo) {
            return {
                success: true,
                msg: 'PO updated successfully!',
                data: response.data.data.updatePo 
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        
        return {
            success: false,
            msg: 'Failed to update PO. Please contact system administrator'
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
            updatePo(
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

        if(response.data && response.data.data && response.data.data.updatePo) {
            return {
                success: true,
                msg: 'PO cancelled!' 
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        
        return {
            success: false,
            msg: 'Failed to cancel PO. Please contact system administrator'
        };
    }
}