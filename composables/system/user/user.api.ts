import { sendRequest } from "~/utils/api"
import type { User, CreateUserInput, MutationResponse, FindAllResponse, UpdateUserInput } from "./user.types";



export async function findAll(payload: { page: number, pageSize: number, searchValue: string | null }): Promise<FindAllResponse> {

    const { page, pageSize, searchValue } = payload;

    let value = null

    if (searchValue) {
        value = `"${searchValue}"`
    }


    const query = `
        query {
            users(
                page: ${page},
                pageSize: ${pageSize},
                searchValue: ${value},
            ) {
                data {
                    id
                    username
                    firstname
                    middlename
                    lastname
                    status
                    role
                    user_employee {
                        employee {
                            id 
                            firstname
                            middlename
                            lastname
                        }
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
        return response.data.data.users;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<Employee | undefined> {
    const query = `
        query {
            user(id: "${id}") {
                id
                username
                firstname
                middlename
                lastname
                role
                status
                permissions
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.user) {
            return response.data.data.user;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function create(input: CreateUserInput): Promise<MutationResponse> {

    let employee_id = null
    let middlename = null
    let permissions = null

    if (input.employee) {
        employee_id = `"${input.employee.id}"`
    }

    if (input.middlename) {
        middlename = `"${input.middlename}"`
    }

    if (input.permissions) {
        permissions = JSON.stringify(input.permissions)
    }

    const mutation = `
        mutation {
            createUser(
                employee_id: ${employee_id},
                username: "${input.username}",
                firstname: "${input.firstname}",
                middlename: ${input.middlename},
                lastname: "${input.lastname}",
                role: ${input.role},
                permissions: ${input.permissions},
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createUser) {
            return {
                success: true,
                msg: 'User created successfully!',
                data: response.data.data.createUser
            }
        }

        throw new Error(JSON.stringify(response.data.errors));


    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create User. Please contact system administrator'
        }

    }
}

export async function updateUserInfo(id: string, input: UpdateUserInput): Promise<MutationResponse> {

    let middlename = null

    if (input.middlename) {
        middlename = `"${input.middlename}"`
    }

    const mutation = `
        mutation {
            updateUser(
                firstname: "${input.firstname}",
                middlename: ${input.middlename},
                lastname: "${input.lastname}",
                role: ${input.role},
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateUser) {
            return {
                success: true,
                msg: 'User updated successfully!',
                data: response.data.data.updateUser
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update User. Please contact system administrator'
        }

    }
}

export async function remove(id: string): Promise<{ success: boolean, msg: string }> {
    const mutation = `
        mutation {
            removeUser(id: "${id}"){
                success
                msg
            }
        }
    `;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.removeUser) {
            return response.data.data.removeUser
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            success: false,
            msg: 'Failed to remove User. Please contact system administrator'
        }
    }
}