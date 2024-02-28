import type { MEQS } from "../meqs/meqs.types";
import type { PoApproverSettings } from "./po-approver.types";
import type { PO } from "./po.types";



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

        if(data.PoApproverSettings) {
            approvers = data.PoApproverSettings
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