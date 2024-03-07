import type { PendingApproval } from "./pendings.types";



export async function getPendingsByEmployeeId(employeeId: string): Promise<{ pendings: PendingApproval[] }> {
    const query = `
        query {
            employee(id: "${employeeId}") {
                pending_approvals {
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