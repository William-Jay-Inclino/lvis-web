

export async function fetchFormDataInCreate(): Promise<{
    employees: Employee[]
}> {


    const query = `
        query {
            employees(page: 1, pageSize: 100) {
                data {
                    id
                    firstname
                    middlename
                    lastname
                }
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        return {
            employees,
        }

    } catch (error) {
        console.error(error);
        return {
            employees: [],
        }
    }


}