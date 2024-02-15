import type { FindAllResponse } from "./canvass.types";


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