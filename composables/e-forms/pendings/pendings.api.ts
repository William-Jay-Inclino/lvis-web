import type { ApproveOrDisapprovePayload, Pending } from "./pendings.types";
import type { Classification } from "~/composables/system/classification/classification";
import type { Account } from "~/composables/system/account/account";



export async function getPendingsByEmployeeId(employeeId: string): Promise<{
    pendings: Pending[],
    classifications: Classification[]
    accounts: Account[]
}> {

    const query = `
        query {
            employee(id: "${employeeId}") {
                pending_approvals {
                    id
                    approver_id
                    reference_number 
                    reference_table
                    description
                    transaction_date
                }
            }
            classifications{
                id
                name
            }
            accounts{
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let pendings = []
        let accounts = []
        let classifications = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employee && data.employee.pending_approvals) {
            pendings = data.employee.pending_approvals
        }

        if (data.accounts) {
            accounts = data.accounts
        }

        if (data.classifications) {
            classifications = data.classifications
        }

        return {
            pendings,
            accounts,
            classifications
        }

    } catch (error) {
        console.error(error);
        return {
            pendings: [],
            accounts: [],
            classifications: [],
        }
    }


}

export async function approvePending(payload: ApproveOrDisapprovePayload): Promise<{success: boolean, msg: string}> {

    const {
        id,
        remarks,
        classification_id,
        fund_source_id,
    } = payload

    const _classification_id = !!classification_id ? `"${classification_id}"` : null
    const _fund_source_id = !!fund_source_id ? `"${fund_source_id}"` : null

        const mutation = `
            mutation {
                approve_pending(
                    id: ${id},
                    remarks: "${remarks}",
                    classification_id: ${_classification_id},
                    fund_source_id: ${_fund_source_id},
                ) {
                    success
                    msg
                }
            }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.approve_pending) {

            if(!!response.data.data.approve_pending.success) {
               return {
                   success: true,
                   msg: 'Approved successfully!',
               };
            } else {
                return {
                    success: false,
                    msg: `Failed to approve. Please reload the page and then try again`,
                };
            }

        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to approve. Please contact system administrator'
        };
    }
}

export async function disapprovePending(payload: ApproveOrDisapprovePayload): Promise<{success: boolean, msg: string}> {

    const {
        id,
        remarks,
        classification_id,
        fund_source_id,
    } = payload

    const _classification_id = !!classification_id ? `"${classification_id}"` : null
    const _fund_source_id = !!fund_source_id ? `"${fund_source_id}"` : null
    
    const mutation = `
        mutation {
            disapprove_pending(
                id: ${id},
                remarks: "${remarks}",
                classification_id: ${_classification_id},
                fund_source_id: ${_fund_source_id},
            ) {
                success
                msg
            }
        }`;

try {
    const response = await sendRequest(mutation);
    console.log('response', response);

    if (response.data && response.data.data && response.data.data.disapprove_pending) {

        if(!!response.data.data.disapprove_pending.success) {
           return {
               success: true,
               msg: 'Disapproved successfully!',
           };
        } else {
            return {
                success: false,
                msg: `Failed to disapprove. Please reload the page and then try again`,
            };
        }

    }

    throw new Error(JSON.stringify(response.data.errors));

} catch (error) {
    console.error(error);

    return {
        success: false,
        msg: 'Failed to disapprove. Please contact system administrator'
    };
}
}