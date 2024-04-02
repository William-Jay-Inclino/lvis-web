import { APPROVAL_STATUS } from "#imports";
import moment from "moment";
import type { PendingApproval } from "./pendings.types";
import type { Classification } from "~/composables/system/classification/classification";
import type { Account } from "~/composables/system/account/account";



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

export async function fetchDataForBudgetOfficer(employeeId: string): Promise<{
    pendings: PendingApproval[],
    classifications: Classification[]
}> {


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
            classifications{
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let pendings = []
        let classifications = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employee && data.employee.pending_approvals) {
            pendings = data.employee.pending_approvals
        }

        if (data.classifications) {
            classifications = data.classifications
        }

        return {
            pendings,
            classifications,
        }

    } catch (error) {
        console.error(error);
        return {
            pendings: [],
            classifications: [],
        }
    }


}

export async function fetchDataForFinanceManager(employeeId: string): Promise<{
    pendings: PendingApproval[],
    accounts: Account[]
}> {


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

        return {
            pendings,
            accounts,
        }

    } catch (error) {
        console.error(error);
        return {
            pendings: [],
            accounts: [],
        }
    }


}

export async function updateStatus(mutationName: string, payload: {
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
            ${mutationName}(
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

        if (response.data && response.data.data && response.data.data[mutationName]) {

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

export async function update_classification_and_approver(mutationName: string, payload: {
    id: string,
    classificationId: string,
    notes: string
    status: APPROVAL_STATUS,
}): Promise<{
    success: boolean,
    msg: string
}> {

    const { id, status, notes, classificationId } = payload

    const mutation = `
        mutation {
            ${mutationName}(
                id: "${id}",
                input: {
                    classification_id: "${classificationId}"
                    notes: "${notes}"
                    status: ${status}
                }
            ) {
                success 
                msg
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data[mutationName]) {

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

export async function update_fund_source_and_po_approver(mutationName: string, payload: {
    id: string,
    fundSourceId: string,
    notes: string
    status: APPROVAL_STATUS,
}): Promise<{
    success: boolean,
    msg: string
}> {

    const { id, status, notes, fundSourceId } = payload

    const mutation = `
        mutation {
            ${mutationName}(
                id: "${id}",
                input: {
                    fund_source_id: "${fundSourceId}"
                    notes: "${notes}"
                    status: ${status}
                }
            ) {
                success 
                msg
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data[mutationName]) {

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

// export async function updateSprStatus(payload: {
//     id: string,
//     status: APPROVAL_STATUS,
//     notes: string
// }): Promise<{
//     success: boolean,
//     msg: string
// }> {

//     const { id, status, notes } = payload

//     const today = moment().format('MM/DD/YYYY')

//     const mutation = `
//         mutation {
//             updateSprApprover(
//                 id: "${id}",
//                 input: {
//                     notes: "${notes}"
//                     status: ${status}
//                     date_approval: "${today}"
//                 }
//             ) {
//                 id
//             }
//         }`;

//     try {
//         const response = await sendRequest(mutation);
//         console.log('response', response);

//         if (response.data && response.data.data && response.data.data.updateSprApprover) {

//             let msg = 'Approved'

//             if (status === APPROVAL_STATUS.DISAPPROVED) {
//                 msg = 'Disapproved'
//             }

//             return {
//                 success: true,
//                 msg: `Transaction ${msg} successfully!`,
//             };
//         }

//         throw new Error(JSON.stringify(response.data.errors));

//     } catch (error) {
//         console.error(error);

//         return {
//             success: false,
//             msg: 'Failed to execute action. Please contact system administrator'
//         };
//     }
// }

// export async function updateJoStatus(payload: {
//     id: string,
//     status: APPROVAL_STATUS,
//     notes: string
// }): Promise<{
//     success: boolean,
//     msg: string
// }> {

//     const { id, status, notes } = payload

//     const today = moment().format('MM/DD/YYYY')

//     const mutation = `
//         mutation {
//             updateJoApprover(
//                 id: "${id}",
//                 input: {
//                     notes: "${notes}"
//                     status: ${status}
//                     date_approval: "${today}"
//                 }
//             ) {
//                 id
//             }
//         }`;

//     try {
//         const response = await sendRequest(mutation);
//         console.log('response', response);

//         if (response.data && response.data.data && response.data.data.updateJoApprover) {

//             let msg = 'Approved'

//             if (status === APPROVAL_STATUS.DISAPPROVED) {
//                 msg = 'Disapproved'
//             }

//             return {
//                 success: true,
//                 msg: `Transaction ${msg} successfully!`,
//             };
//         }

//         throw new Error(JSON.stringify(response.data.errors));

//     } catch (error) {
//         console.error(error);

//         return {
//             success: false,
//             msg: 'Failed to execute action. Please contact system administrator'
//         };
//     }
// }

// export async function updateMeqsStatus(payload: {
//     id: string,
//     status: APPROVAL_STATUS,
//     notes: string
// }): Promise<{
//     success: boolean,
//     msg: string
// }> {

//     const { id, status, notes } = payload

//     const today = moment().format('MM/DD/YYYY')

//     const mutation = `
//         mutation {
//             updateMeqsApprover(
//                 id: "${id}",
//                 input: {
//                     notes: "${notes}"
//                     status: ${status}
//                     date_approval: "${today}"
//                 }
//             ) {
//                 id
//             }
//         }`;

//     try {
//         const response = await sendRequest(mutation);
//         console.log('response', response);

//         if (response.data && response.data.data && response.data.data.updateMeqsApprover) {

//             let msg = 'Approved'

//             if (status === APPROVAL_STATUS.DISAPPROVED) {
//                 msg = 'Disapproved'
//             }

//             return {
//                 success: true,
//                 msg: `Transaction ${msg} successfully!`,
//             };
//         }

//         throw new Error(JSON.stringify(response.data.errors));

//     } catch (error) {
//         console.error(error);

//         return {
//             success: false,
//             msg: 'Failed to execute action. Please contact system administrator'
//         };
//     }
// }

// export async function updatePoStatus(payload: {
//     id: string,
//     status: APPROVAL_STATUS,
//     notes: string
// }): Promise<{
//     success: boolean,
//     msg: string
// }> {

//     const { id, status, notes } = payload

//     const today = moment().format('MM/DD/YYYY')

//     const mutation = `
//         mutation {
//             updatePoApprover(
//                 id: "${id}",
//                 input: {
//                     notes: "${notes}"
//                     status: ${status}
//                     date_approval: "${today}"
//                 }
//             ) {
//                 id
//             }
//         }`;

//     try {
//         const response = await sendRequest(mutation);
//         console.log('response', response);

//         if (response.data && response.data.data && response.data.data.updatePoApprover) {

//             let msg = 'Approved'

//             if (status === APPROVAL_STATUS.DISAPPROVED) {
//                 msg = 'Disapproved'
//             }

//             return {
//                 success: true,
//                 msg: `Transaction ${msg} successfully!`,
//             };
//         }

//         throw new Error(JSON.stringify(response.data.errors));

//     } catch (error) {
//         console.error(error);

//         return {
//             success: false,
//             msg: 'Failed to execute action. Please contact system administrator'
//         };
//     }
// }

// export async function updateRrStatus(payload: {
//     id: string,
//     status: APPROVAL_STATUS,
//     notes: string
// }): Promise<{
//     success: boolean,
//     msg: string
// }> {

//     const { id, status, notes } = payload

//     const today = moment().format('MM/DD/YYYY')

//     const mutation = `
//         mutation {
//             updateRrApprover(
//                 id: "${id}",
//                 input: {
//                     notes: "${notes}"
//                     status: ${status}
//                     date_approval: "${today}"
//                 }
//             ) {
//                 id
//             }
//         }`;

//     try {
//         const response = await sendRequest(mutation);
//         console.log('response', response);

//         if (response.data && response.data.data && response.data.data.updateRrApprover) {

//             let msg = 'Approved'

//             if (status === APPROVAL_STATUS.DISAPPROVED) {
//                 msg = 'Disapproved'
//             }

//             return {
//                 success: true,
//                 msg: `Transaction ${msg} successfully!`,
//             };
//         }

//         throw new Error(JSON.stringify(response.data.errors));

//     } catch (error) {
//         console.error(error);

//         return {
//             success: false,
//             msg: 'Failed to execute action. Please contact system administrator'
//         };
//     }
// }

