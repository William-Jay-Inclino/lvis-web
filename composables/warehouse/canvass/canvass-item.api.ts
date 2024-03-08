import type { CreateCanvassItemInput, MutationResponse, UpdateCanvassItemInput } from "./canvass-item.types";
import { sendRequest } from "~/utils/api"

export async function create(input: CreateCanvassItemInput): Promise<MutationResponse> {

    let brandId = null
    let unitId = null

    if (input.brand) {
        brandId = `"${input.brand.id}"`
    }

    if (input.unit) {
        unitId = `"${input.unit.id}"`
    }

    const mutation = `
        mutation {
            createCanvassItem(
                input: {
                    canvass_id: "${input.canvass_id}"
                    description: "${input.description}"
                    brand_id: ${brandId}
                    unit_id: ${unitId}
                    quantity: ${input.quantity}
                }
            ) {
                id
                canvass_id
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
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createCanvassItem) {
            return {
                success: true,
                msg: 'Canvass Item created successfully!',
                data: response.data.data.createCanvassItem
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Canvass Item. Please contact system administrator'
        };
    }
}


export async function update(id: string, input: UpdateCanvassItemInput): Promise<MutationResponse> {

    console.log('input', input)

    let brandId = null
    let unitId = null

    if (input.brand) {
        brandId = `"${input.brand.id}"`
    }

    if (input.unit) {
        unitId = `"${input.unit.id}"`
    }

    const mutation = `
        mutation {
            updateCanvassItem(
                id: "${id}",
                input: {
                    description: "${input.description}"
                    brand_id: ${brandId}
                    unit_id: ${unitId}
                    quantity: ${input.quantity}
                }
            ) {
                id
                canvass_id
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
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateCanvassItem) {
            return {
                success: true,
                msg: 'Canvass Item updated successfully!',
                data: response.data.data.updateCanvassItem
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Canvass Item. Please contact system administrator'
        };
    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {

    const mutation = `
        mutation {
            removeCanvassItem(
                id: "${id}"
            ) {
                success
                msg
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.removeCanvassItem) {
            return {
                success: response.data.data.removeCanvassItem.success,
                msg: response.data.data.removeCanvassItem.msg
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to remove Canvass Item. Please contact system administrator'
        };
    }
}