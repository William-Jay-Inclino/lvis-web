import type { ApproverMutationResponse, ApproverSetting, CreateApproverSetting, UpdateApproverSetting } from "./warehouse.types";



export async function findAllDefaultApprovers(model: string): Promise<ApproverSetting[]> {

    const query = `
        query {
            ${model} {
                id
                approver {
                    id
                    firstname
                    middlename
                    lastname
                }
                label
                order
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        return response.data.data[model]

    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function initPurchasingTabData(): Promise<{
    employees: Employee[]
}> {

    const query = `
        query {
            employees(page: 1, pageSize: 20) {
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

        return {
            employees: response.data.data.employees.data
        }

    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function createApprover(input: CreateApproverSetting, transaction: string): Promise<ApproverMutationResponse> {

    const mutation = `
        mutation {
            ${transaction}(
                input: {
                    approver_id: "${input.approver?.id}"
                    label: "${input.label}"
                    order: ${input.order}
                }
            ) {
                id
                approver {
                    id
                    firstname
                    middlename
                    lastname
                }
                label
                order
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data[transaction]) {
            return {
                success: true,
                msg: 'Approver added!',
                data: response.data.data[transaction]
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Approver. Please contact system administrator'
        };
    }
}

export async function removeApprover(id: string, transaction: string): Promise<{ success: boolean, msg: string }> {

    const mutation = `
        mutation {
            ${transaction}(
                id: "${id}"
            ) {
                success
                msg
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data[transaction]) {
            return {
                success: response.data.data[transaction].success,
                msg: response.data.data[transaction].msg
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to remove Approver. Please contact system administrator'
        };
    }
}

export async function updateApprover(input: UpdateApproverSetting, transaction: string): Promise<ApproverMutationResponse> {

    const mutation = `
        mutation {
            ${transaction}(
                id: "${input.id}",
                input: {
                    approver_id: "${input.approver?.id}"
                    label: "${input.label}"
                }
            ) {
                id
                approver {
                    id
                    firstname
                    middlename
                    lastname
                }
                label
                order
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data[transaction]) {
            return {
                success: true,
                msg: 'Approver updated!',
                data: response.data.data[transaction]
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update Approver. Please contact system administrator'
        };
    }
}