import type { RV } from "../rv/rv.types";
import type { MEQS } from "./meqs.types";


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