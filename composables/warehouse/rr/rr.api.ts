import type { Brand } from "../canvass/canvass.types"
import type { PO } from "../po/po.types"
import type { Unit } from "../unit/unit.types"
import type { RrApproverSettings } from "./rr-approver.types"
import type { FindAllResponse, RR } from "./rr.types"


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
        }

    } catch (error) {
        console.error(error);
        return {
            pos: [],
            approvers: [],
            brands: [],
            units: [],
            employees: []
        }
    }
    

}