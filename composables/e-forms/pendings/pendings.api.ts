import { APPROVAL_STATUS } from "#imports";
import moment from "moment";
import type { PENDING_APPROVAL_TYPE, PendingApproval } from "./pendings.types";



export async function getPendingsByEmployeeId(employeeId: string): Promise<{ pendings: PendingApproval[] }> {
    const query = `
        query {
            employee(id: "${employeeId}") {
                pending_approvals {
                    id
                    type
                    description
                    reference_id 
                    transaction_date
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.employee && response.data.data.employee.pending_approvals) {
            return {
                pendings: response.data.data.employee.pending_approvals
            }
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return {
            pendings: []
        }
    }
}


export async function updateRvStatus(payload: {
    id: string,
    status: APPROVAL_STATUS,
    notes: string
}): Promise<{
    success: boolean,
    msg: string
}> {

    const { id, status, notes } = payload

    const today = moment().format('MM/DD/YYYY')

    const mutation = `
        mutation {
            updateRvApprover(
                id: "${id}",
                input: {
                    notes: "${notes}"
                    status: ${status}
                    date_approval: "${today}"
                }
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateRvApprover) {

            let msg = 'Approved'

            if (status === APPROVAL_STATUS.DISAPPROVED) {
                msg = 'Disapproved'
            }

            return {
                success: true,
                msg: `Transaction ${msg} successfully!`,
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to execute action. Please contact system administrator'
        };
    }
}

export async function updateMeqsStatus(payload: {
    id: string,
    status: APPROVAL_STATUS,
    notes: string
}): Promise<{
    success: boolean,
    msg: string
}> {

    const { id, status, notes } = payload

    const today = moment().format('MM/DD/YYYY')

    const mutation = `
        mutation {
            updateMeqsApprover(
                id: "${id}",
                input: {
                    notes: "${notes}"
                    status: ${status}
                    date_approval: "${today}"
                }
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateMeqsApprover) {

            let msg = 'Approved'

            if (status === APPROVAL_STATUS.DISAPPROVED) {
                msg = 'Disapproved'
            }

            return {
                success: true,
                msg: `Transaction ${msg} successfully!`,
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to execute action. Please contact system administrator'
        };
    }
}