import type { Pending } from "./pendings.types";
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