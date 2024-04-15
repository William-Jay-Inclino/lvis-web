import { sendRequest } from "~/utils/api"
import type { Employee, CreateEmployeeInput, MutationResponse, FindAllResponse } from "./employee.types";
import axios from "axios";



export async function findAll(payload: { page: number, pageSize: number, searchValue: string | null }): Promise<FindAllResponse> {

    const { page, pageSize, searchValue } = payload;

    let value = null

    if (searchValue) {
        value = `"${searchValue}"`
    }


    const query = `
        query {
            employees(
                page: ${page},
                pageSize: ${pageSize},
                searchValue: ${value},
            ) {
                data {
                    id
                    firstname
                    middlename
                    lastname
                    position
                    signature_src
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
        return response.data.data.employees;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<Employee | undefined> {
    const query = `
        query {
            employee(id: "${id}") {
                id
                firstname
                middlename
                lastname
                position
                signature_src
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.employee) {
            return response.data.data.employee;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateEmployeeInput): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => `${field}: "${input[field as keyof CreateEmployeeInput]}"`)
        .join(', ');

    const mutation = `
        mutation {
            createEmployee(input: { ${inputFields} }) {
                id
                firstname
                middlename
                lastname
                position
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createEmployee) {
            return {
                success: true,
                msg: 'Employee created successfully!',
                data: response.data.data.createEmployee
            }
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Employee. Please contact system administrator'
        }

    }
}

export async function update(id: string, input: CreateEmployeeInput): Promise<MutationResponse> {

    const inputFields = Object.keys(input)
        .map(field => `${field}: "${input[field as keyof CreateEmployeeInput]}"`)
        .join(', ');

    const mutation = `
        mutation {
            updateEmployee(id: "${id}", input: { ${inputFields} }) {
                id
                firstname
                middlename
                lastname
                position
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateEmployee) {
            return {
                success: true,
                msg: 'Employee updated successfully!',
                data: response.data.data.updateEmployee
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Employee. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {
    const mutation = `
        mutation {
            removeEmployee(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeEmployee) {
            return response.data.data.removeEmployee
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove Employee. Please contact system administrator'
        }
    }
}

export async function uploadSingleAttachment(attachment: any, apiUrl: string): Promise<string | null> {

    console.log('uploadSingleAttachment', attachment)

    const image = attachment

    console.log('image', image)

    const formData = new FormData();

    formData.append('file', image)

    const fileUploadApi = apiUrl + '/api/v1/file-upload/system/employee/single'

    try {
        const response = await axios.post(fileUploadApi, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('response', response.data);

        if (response.data && response.data.success && response.data.data) {
            return response.data.data as string
        }

        return null

    } catch (error) {
        console.error('Error uploading image:', error);
        return null
    }

}