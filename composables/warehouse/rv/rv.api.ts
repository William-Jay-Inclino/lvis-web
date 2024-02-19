import type { Canvass, Employee } from "../canvass/canvass.types";
import type { CreateRvInput, FindAllResponse, MutationResponse, RV, RvApproverSettings } from "./rv.types";
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

export async function findOne(id: string): Promise<RV | undefined> {
    const query = `
        query {
            rv(id: "${id}") {
                id
                rv_number
                canvass {
                    id
                    rc_number
                    requested_by {
                        firstname 
                        middlename 
                        lastname
                    }
                    purpose
                }
                supervisor {
                    firstname 
                    middlename 
                    lastname
                }
                date_requested 
                work_order_no
                work_order_date
                notes
                status
                rv_approvers{
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

export async function fetchFormDataInCreate(): Promise<{
    canvasses: Canvass[],
    employees: Employee[],
    approvers: RvApproverSettings[]
}> {

    const query = `
        query {
            canvasses(page: 1, pageSize: 10) {
                data{
                    id
                    rc_number
                    requested_by {
                        id
                        firstname
                        middlename
                        lastname
                    }
                    purpose
                }
            },
            employees(page: 1, pageSize: 50) {
                data{
                    id
                    firstname
                    middlename
                    lastname
                }
            },
            rvApproverSettings{
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
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let canvasses = []
        let employees = []
        let approvers = []

        if(!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if(data.canvasses && data.canvasses.data) {
            canvasses = response.data.data.canvasses.data
        }

        if(data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if(data.rvApproverSettings) {
            approvers = data.rvApproverSettings
        }

        return {
            canvasses,
            employees,
            approvers
        }

    } catch (error) {
        console.error(error);
        return {
            canvasses: [],
            employees: [],
            approvers: [],
        }
    }
    

}

export async function create(input: CreateRvInput): Promise<MutationResponse> {

    // set the supervisor as the 1st approver
    input.approvers.push({
        approver_id: input.supervisor!.id,
        approver: input.supervisor,
        label: 'Imd. Sup,',
        order: 1
    })

    const approvers = input.approvers.map(item => {

        let approver_proxy_id = null 

        if(item.approver_proxy) {
            approver_proxy_id = `"${item.approver_proxy.id}"`
        }

        return `
        {
          approver_id: "${item.approver?.id}"
          approver_proxy_id: ${approver_proxy_id}
          label: "${item.label}"
          order: ${item.order}
        }`;
    }).join(', ');

    const mutation = `
        mutation {
            createRv(
                input: {
                    canvass_id: "${input.canvass?.id}"
                    supervisor_id: "${input.supervisor?.id}"
                    date_requested: "${input.date_requested}"
                    work_order_no: "${input.work_order_no}"
                    work_order_date: "${input.work_order_date}"
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

        if(response.data && response.data.data && response.data.data.createRv) {
            return {
                success: true,
                msg: 'RV created successfully!',
                data: response.data.data.createRv 
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        
        return {
            success: false,
            msg: 'Failed to create RV. Please contact system administrator'
        };
    }
}