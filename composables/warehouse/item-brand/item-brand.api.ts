import { sendRequest } from "~/utils/api"
import type { ItemBrand, CreateItemBrandInput, MutationResponse } from "./item-brand.types";



export async function findAll(): Promise<ItemBrand[]> {

    const query = `
        query {
            brands {
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return response.data.data.brands;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<ItemBrand | undefined> {
    const query = `
        query {
            brand(id: "${id}") {
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.brand) {
            return response.data.data.brand;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateItemBrandInput): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => `${field}: "${input[field as keyof CreateItemBrandInput]}"`)
        .join(', ');

    const mutation = `
        mutation {
            createBrand(input: { ${inputFields} }) {
                id 
                name
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createBrand) {
            return {
                success: true,
                msg: 'Item Brand created successfully!',
                data: response.data.data.createBrand
            }
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Item Brand. Please contact system administrator'
        }

    }
}

export async function update(id: string, input: CreateItemBrandInput): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => `${field}: "${input[field as keyof CreateItemBrandInput]}"`)
        .join(', ');

    const mutation = `
        mutation {
            updateBrand(id: "${id}", input: { ${inputFields} }) {
                id 
                name
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateBrand) {
            return {
                success: true,
                msg: 'Item Brand updated successfully!',
                data: response.data.data.updateBrand
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Item Brand. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {
    const mutation = `
        mutation {
            removeBrand(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeBrand) {
            return response.data.data.removeBrand
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Item Brand. Please contact system administrator'
        }
    }
}