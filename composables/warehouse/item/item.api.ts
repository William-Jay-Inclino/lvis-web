import type { FindAllResponse } from "./item.type";



export async function fetchDataInSearchFilters(): Promise<{
    items: Item[],
    itemTypes: ItemType[]
}>{
    const query = `
        query {
            items(page: 1, pageSize: 10) {
                data{
                    code
                }
            },
            item_types{
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let items = []
        let itemTypes = []

        if(!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if(data.item && data.item.data) {
            items = response.data.data.item.data
        }

        if(data.item_types) { 
            itemTypes = data.item_types
        }
        return {
            items,
            itemTypes
        }

    } catch (error) {
        console.error(error);
        return {
            items: [],
            itemTypes: [],
        }
    }
}

export async function findAll(payload: {page: number, pageSize: number, name: string | null, item_type_id: string | null}): Promise<FindAllResponse> {
    
    const { page, pageSize, name, item_type_id } = payload;

    let name2 = null
    let item_type_id2 = null

    if(name) {
        name2 = `"${name}"`
    } 

    if(item_type_id) {
        item_type_id2 = `"${item_type_id}"`
    }

    const query = `
        query {
            items(
                page: ${page},
                pageSize: ${pageSize},
                name: ${name2},
                item_type_id: ${item_type_id2},
            ) {
                data {
                    id
                    code 
                    name
                    description
                    total_quantity
                    item_type {
                        id 
                        name
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
        return response.data.data.items;
    } catch (error) {
        console.error(error);
        throw error
    }
}



export async function findByCode(code: string): Promise<Item | undefined> {
    const query = `
        query {
            item(code: "${code}") {
                id
                code 
                name
                description
                total_quantity
                item_type {
                    id 
                    name
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if(response.data && response.data.data && response.data.data.item) {
            return response.data.data.item;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}