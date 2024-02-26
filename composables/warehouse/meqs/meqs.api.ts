import axios from "axios";
import type { RV } from "../rv/rv.types";
import type { FindAllResponse, MEQS, MeqsApproverSettings, Supplier } from "./meqs.types";


export async function fetchDataInSearchFilters(): Promise<{
    meqs: MEQS[],
    employees: Employee[],
    rvs: RV[],
}> {
    const query = `
        query {
            meqs(page: 1, pageSize: 10) {
                data{
                    meqs_number
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

        let meqs = []
        let rvs = []
        let employees = []

        if(!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        console.log('data', data)

        if(data.employees && data.employees.data) {
            employees = data.employees.data
        }

        if(data.meqs && data.meqs.data) { 
            meqs = data.meqs.data
        }

        if(data.rvs && data.rvs.data) { 
            rvs = data.rvs.data
        }

        return {
            meqs,
            employees,
            rvs
        }

    } catch (error) {
        console.error(error);
        return {
            meqs: [],
            employees: [],
            rvs: []
        }
    }
}

export async function findByMeqsNumber(meqsNumber: string): Promise<MEQS | undefined> {
    const query = `
        query {
            meq(meqs_number: "${meqsNumber}") {
                id
                meqs_number
                rv {
                    rv_number
                    canvass {
                        requested_by {
                            id
                            firstname
                            middlename
                            lastname
                        }
                    }
                }
                meqs_date
                meqs_approvers {
                    status
                }
                is_cancelled
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if(response.data && response.data.data && response.data.data.meq) {
            return response.data.data.meq;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findByReferenceNumber(payload: {
    rv_number?: string,
    jo_number?: string,
    spr_number?: string 
}): Promise<MEQS | undefined> {

    const { rv_number, jo_number, spr_number } = payload;
    let searchField: string | undefined;

    if (rv_number) {
        searchField = 'rv_number';
    } else if (jo_number) {
        searchField = 'jo_number';
    } else if (spr_number) {
        searchField = 'spr_number';
    }

    const query = `
        query {
            meq(${searchField}: "${rv_number ?? jo_number ?? spr_number}") {
                id
                meqs_number
                rv {
                    rv_number
                    canvass {
                        requested_by {
                            id
                            firstname
                            middlename
                            lastname
                        }
                    }
                }
                meqs_date
                meqs_approvers {
                    status
                }
                is_cancelled
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if(response.data && response.data.data && response.data.data.meq) {
            return response.data.data.meq;
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
            meqs(
                page: ${page},
                pageSize: ${pageSize},
                date_requested: ${date_requested2},
                requested_by_id: ${requested_by_id2},
            ) {
                data {
                    id
                    meqs_number
                    rv {
                        rv_number
                        canvass {
                            requested_by {
                                id
                                firstname
                                middlename
                                lastname
                            }
                        }
                    }
                    meqs_date
                    meqs_approvers {
                        status
                    }
                    is_cancelled
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
        return response.data.data.meqs;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function fetchFormDataInCreate(): Promise<{
    rvs: RV[],
    suppliers: Supplier[],
    approvers: MeqsApproverSettings[]
}> {

    const query = `
        query {
            rvs(page: 1, pageSize: 10) {
                data{
                    id
                    rv_number
                    status
                    is_referenced
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
                        canvass_items{
                            id
                            canvass_id
                            description
                            brand{
                                id
                                name
                            }
                            unit{
                                id
                                name
                            }
                            quantity
                        }
                    }
                }
            },
            suppliers{
                id 
                name
            },
            meqsApproverSettings{
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

        let rvs = []
        let suppliers = []
        let approvers = []

        if(!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if(data.rvs && data.rvs.data) {
            rvs = response.data.data.rvs.data
        }

        if(data.suppliers) {
            suppliers = data.suppliers
        }

        if(data.meqsApproverSettings) {
            approvers = data.meqsApproverSettings
        }

        return {
            rvs,
            suppliers,
            approvers
        }

    } catch (error) {
        console.error(error);
        return {
            rvs: [],
            suppliers: [],
            approvers: []
        }
    }
    

}


export async function uploadAttachments(attachments: any[], apiUrl: string): Promise<string[] | null> {

    console.log('uploadAttachments', attachments)

    const images = attachments.map(i => i.file)

    console.log('images', images)

    const formData = new FormData();

    for(let img of images) {
        formData.append('files', img)
    }

    const fileUploadApi = apiUrl + '/api/v1/file-upload/warehouse/meqs/multiple'

    try {
        const response = await axios.post(fileUploadApi, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
      
          console.log('response', response.data);

          if(response.data && response.data.success && response.data.data) {
            return response.data.data as string[]
          }

          return null

    } catch (error) {
        console.error('Error uploading images:', error);
        return null
    }

}