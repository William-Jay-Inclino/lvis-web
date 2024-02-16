import type { Brand, Canvass, Employee, FindAllResponse, Unit } from "./canvass.types";


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
            canvasses(
                page: ${page},
                pageSize: ${pageSize},
                date_requested: ${date_requested2},
                requested_by_id: ${requested_by_id2},
            ) {
                data {
                    id
                    rc_number
                    date_requested
                    requested_by {
                        id
                        firstname
                        middlename
                        lastname
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
        return response.data.data.canvasses;
    } catch (error) {
        console.error(error);
        throw error
    }
}


export async function findByRcNumber(rcNumber: string): Promise<Canvass | undefined> {
    const query = `
        query {
            canvass(rc_number: "${rcNumber}") {
                id
                rc_number
                date_requested
                requested_by {
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

        if(response.data && response.data.data && response.data.data.canvass) {
            return response.data.data.canvass;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function fetchFormData(): Promise<{
    employees: Employee[],
    brands: Brand[],
    units: Unit[],
}> {


    const query = `
        query {
            employees(page: 1, pageSize: 10) {
            data {
                id
                firstname
                middlename
                lastname
            }
            },
            brands{
            id
            name
            }
            units(page: 1, pageSize: 10){
            data {
                id
                name
            }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees = []
        let brands = []
        let units = []

        if(!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if(data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if(data.brands) { // temp
            brands = data.brands
        }

        if(data.units && data.units.data) {
            units = response.data.data.units.data
        }

        return {
            employees,
            brands,
            units
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            employees: [],
            brands: [],
            units: []
        }
    }
    

}