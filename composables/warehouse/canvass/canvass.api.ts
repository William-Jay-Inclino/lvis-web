import type { Brand, Canvass, CreateCanvassInput, Employee, FindAllResponse, MutationResponse, Unit, UpdateCanvassInput } from "./canvass.types";


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

export async function fetchFormDataInUpdate(id: string): Promise<{
    canvass: Canvass | undefined,
    employees: Employee[],
    brands: Brand[],
    units: Unit[],
}> {
    const query = `
        query {
            canvass(id: "${id}") {
                id
                rc_number
                date_requested
                purpose
                notes
                requested_by {
                    id
                    firstname
                    middlename
                    lastname
                }
                canvass_items{
                    id
                    description
                    brand {
                        name
                    }
                    unit {
                        name
                    }
                    quantity
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

        if(!data.canvass) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const canvass = data.canvass

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
            canvass,
            employees,
            brands,
            units
        }

    } catch (error) {
        console.error(error);
        return {
            canvass: undefined,
            employees: [],
            brands: [],
            units: []
        }
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

export async function findOne(id: string): Promise<Canvass | undefined> {
    const query = `
        query {
            canvass(id: "${id}") {
                id
                rc_number
                date_requested
                purpose 
                notes
                requested_by {
                    id
                    firstname
                    middlename
                    lastname
                }
                canvass_items {
                    description
                    unit {
                        name
                    }
                    brand {
                        name
                    }
                    quantity
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

export async function fetchFormDataInCreate(): Promise<{
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

    } catch (error) {
        console.error(error);
        return {
            employees: [],
            brands: [],
            units: []
        }
    }
    

}

export async function create(input: CreateCanvassInput): Promise<MutationResponse> {
    const canvassItems = input.canvass_items.map(item => {
        return `
        {
          description: "${item.description}"
          brand_id: "${item.brand?.id}"
          unit_id: "${item.unit?.id}"
          quantity: ${item.quantity}
        }`;
    }).join(', ');

    const mutation = `
        mutation {
            createCanvass(
                input: {
                    date_requested: "${input.date_requested}"
                    purpose: "${input.purpose}"
                    notes: "${input.notes}"
                    requested_by_id: "${input.requested_by?.id}"
                    canvass_items: [${canvassItems}]
                }
            ) {
                id
                rc_number
                date_requested
                purpose
                notes
                requested_by_id
                canvass_items {
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
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if(response.data && response.data.data && response.data.data.createCanvass) {
            return {
                success: true,
                msg: 'Canvass created successfully!',
                data: response.data.data.createCanvass 
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        
        return {
            success: false,
            msg: 'Failed to create Canvass. Please contact system administrator'
        };
    }
}

export async function update(id: string, input: UpdateCanvassInput): Promise<MutationResponse> {

    const mutation = `

        mutation {
            updateCanvass(
                id: "${id}",
                input: {
                    purpose: "${input.purpose}"
                    notes: "${input.notes}"
                    requested_by_id: "${input.requested_by?.id}"
                }
            ) {
                id
                rc_number
            }
        }
    
    `

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if(response.data && response.data.data && response.data.data.updateCanvass) {
            return {
                success: true,
                msg: 'Canvass updated successfully!',
                data: response.data.data.updateCanvass 
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        
        return {
            success: false,
            msg: 'Failed to Update Canvass. Please contact system administrator'
        };
    }



}