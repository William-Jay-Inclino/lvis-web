import type { Canvass, Employee } from "../canvass/canvass.types";
import type { FindAllResponse, RV } from "./rv.types";
import { sendRequest } from "~/utils/api"

export async function fetchDataInSearchFilters(): Promise<{
    canvasses: Canvass[],
    rvs: RV[],
    employees: Employee[]
}> {
    const query = `
        query {
            canvasses(page: 1, pageSize: 10) {
                data{
                    rc_number
                }
            },
            rvs(page: 1, pageSize: 10) {
                data{
                    rv_number
                }
            }
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

        let canvasses = []
        let rvs = []
        let employees = []

        if(!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if(data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if(data.canvasses && data.canvasses.data) { 
            canvasses = data.canvasses.data
        }

        if(data.rvs && data.rvs.data) { 
            rvs = data.rvs.data
        }

        return {
            canvasses,
            employees,
            rvs
        }

    } catch (error) {
        console.error(error);
        return {
            canvasses: [],
            employees: [],
            rvs: []
        }
    }
}

export async function findByRcNumber(rcNumber: string): Promise<RV | undefined> {
    const query = `
        query {
            rv(rc_number: "${rcNumber}") {
                id
                rv_number
                canvass{
                    rc_number
                    requested_by {
                        id
                        firstname
                        middlename
                        lastname
                    }
                }
                date_requested
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if(response.data && response.data.data && response.data.data.rv) {
            return response.data.data.rv;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findByRvNumber(rvNumber: string): Promise<RV | undefined> {
    const query = `
        query {
            rv(rv_number: "${rvNumber}") {
                id
                rv_number
                canvass{
                    rc_number
                    requested_by {
                        id
                        firstname
                        middlename
                        lastname
                    }
                }
                date_requested
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if(response.data && response.data.data && response.data.data.rv) {
            return response.data.data.rv;
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
            rvs(
                page: ${page},
                pageSize: ${pageSize},
                date_requested: ${date_requested2},
                requested_by_id: ${requested_by_id2},
            ) {
                data {
                    id
                    rv_number
                    canvass{
                        rc_number
                        requested_by {
                            id
                            firstname
                            middlename
                            lastname
                        }
                    }
                    date_requested
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
        return response.data.data.rvs;
    } catch (error) {
        console.error(error);
        throw error
    }
}