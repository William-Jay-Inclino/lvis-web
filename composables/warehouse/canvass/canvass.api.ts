import type { Employee } from "~/composables/system/employee/employee.types";
import type { Item } from "../item/item.type";
import type { Canvass, CreateCanvassInput, FindAllResponse, MutationResponse, UpdateCanvassInput } from "./canvass.types";
import { sendRequest } from "~/utils/api"

export async function findAll(payload: { page: number, pageSize: number, date_requested: string | null, requested_by_id: string | null }): Promise<FindAllResponse> {

    const { page, pageSize, date_requested, requested_by_id } = payload;

    let date_requested2 = null
    let requested_by_id2 = null

    if (date_requested) {
        date_requested2 = `"${date_requested}"`
    }

    if (requested_by_id) {
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
                    created_by
                    deleted_at
                    can_update
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
                created_by
                deleted_at
                can_update
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

        if (response.data && response.data.data && response.data.data.canvass) {
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
                created_by
                deleted_at
                can_update
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
                    item {
                        id
                        code 
                        name 
                        description
                    }
                }
                rv{
                    id
                    rv_number
                    meqs {
                        id
                        meqs_number
                        meqs_suppliers {
                            po {
                                id
                                po_number
                                rrs {
                                    id
                                    rr_number
                                }
                            }
                        }
                    }
                }
                jo{
                    id
                    jo_number
                    meqs {
                        id
                        meqs_number
                        meqs_suppliers {
                            po {
                                id
                                po_number
                                rrs {
                                    id
                                    rr_number
                                }
                            }
                        }
                    }
                }
                spr{
                    id
                    spr_number
                    meqs {
                        id
                        meqs_number
                        meqs_suppliers {
                            po {
                                id
                                po_number
                                rrs {
                                    id
                                    rr_number
                                }
                            }
                        }
                    }
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.canvass) {
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
    items: Item[],
}> {


    const query = `
        query {
            employees(page: 1, pageSize: 100) {
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
            units{
                id
                name
            }
            items(page: 1, pageSize: 10){
                data {
                    id
                    code
                    name
                    description
                    unit {
                        id 
                        name
                    }
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
        let items = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.brands) {
            brands = data.brands
        }

        if (data.units) {
            units = data.units
        }

        if (data.items && data.items.data) {
            items = response.data.data.items.data
        }

        return {
            employees,
            brands,
            units,
            items
        }

    } catch (error) {
        console.error(error);
        return {
            employees: [],
            brands: [],
            units: [],
            items: []
        }
    }


}

export async function fetchFormDataInUpdate(id: string): Promise<{
    canvass: Canvass | undefined,
    employees: Employee[],
    brands: Brand[],
    units: Unit[],
    items: Item[]
}> {
    const query = `
        query {
            canvass(id: "${id}") {
                id
                rc_number
                date_requested
                purpose
                notes
                created_by
                deleted_at
                is_reference_in_rr
                can_update
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
                        id
                        name
                    }
                    unit {
                        id
                        name
                    }
                    quantity
                    item {
                        id
                        code 
                        name
                        description
                    }
                }
            },
            employees(page: 1, pageSize: 100) {
                data {
                    id
                    firstname
                    middlename
                    lastname
                }
            },
            items(page: 1, pageSize: 10){
                data {
                    id
                    code
                    name
                    description
                    unit {
                        id 
                        name
                    }
                }
            }
            brands{
                id
                name
            }
            units{
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees = []
        let brands = []
        let units = []
        let items = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (!data.canvass) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const canvass = data.canvass

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.brands) { 
            brands = data.brands
        }

        if (data.units) {
            units = data.units
        }

        if (data.items && data.items.data) {
            items = response.data.data.items.data
        }

        return {
            canvass,
            employees,
            brands,
            units,
            items
        }

    } catch (error) {
        console.error(error);
        return {
            canvass: undefined,
            employees: [],
            brands: [],
            units: [],
            items: []
        }
    }
}

export async function fetchDataInSearchFilters(): Promise<{
    canvasses: Canvass[],
    employees: Employee[]
}> {
    const query = `
        query {
            canvasses(page: 1, pageSize: 10) {
                data{
                    rc_number
                }
            },
            employees(page: 1, pageSize: 10) {
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
        let employees = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.canvasses && data.canvasses.data) {
            canvasses = data.canvasses.data
        }
        return {
            canvasses,
            employees
        }

    } catch (error) {
        console.error(error);
        return {
            canvasses: [],
            employees: [],
        }
    }
}

export async function create(input: CreateCanvassInput): Promise<MutationResponse> {

    const canvassItems = input.canvass_items.map(item => {

        let brandId = null
        let unitId = null
        let itemId = null

        if (item.brand) {
            brandId = `"${item.brand.id}"`
        }

        if (item.unit) {
            unitId = `"${item.unit.id}"`
        }

        if (item.item) {
            itemId = `"${item.item.id}"`
        }

        return `
        {
          description: "${item.description}"
          brand_id: ${brandId}
          unit_id: ${unitId}
          item_id: ${itemId}
          quantity: ${item.quantity}
        }`;
    }).join(', ');

    const mutation = `
        mutation {
            createCanvass(
                input: {
                    purpose: "${input.purpose}"
                    notes: "${input.notes}"
                    requested_by_id: "${input.requested_by?.id}"
                    canvass_items: [${canvassItems}]
                }
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createCanvass) {
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

        if (response.data && response.data.data && response.data.data.updateCanvass) {
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

export async function fetchRcNumbers(payload: string): Promise<Canvass[]> {
    const query = `
        query {
            rc_numbers(rc_number: "${payload}") {
                rc_number
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.rc_numbers

    } catch (error) {
        console.error(error);
        return []
    }
}