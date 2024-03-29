import moment from "moment";
import { VAT_TYPE } from "#imports";

export function getAuthUser(): AuthUser {
    const authUserJson = localStorage.getItem('authUser')

    if (!authUserJson) {
        throw console.error('authUser in localstorage not found');
    }

    const authUser = JSON.parse(authUserJson) as AuthUser

    return authUser
}

export function isAdmin(authUser: AuthUser): boolean {

    return authUser.user.role === ROLE.ADMIN

}

export function isAdminOrOwner(createdBy: string, authUser: AuthUser) {

    const isOwner = authUser.user.username === createdBy

    if (isAdmin(authUser) || isOwner) {
        return true
    }

    return false

}


export function getFullname(firstname: string, middlename: string | null, lastname: string) {
    if (middlename) {
        return lastname + ', ' + firstname + ' ' + convertMiddleNameToInitial(middlename)
    }
    return lastname + ', ' + firstname
}

export function convertMiddleNameToInitial(middleName: string) {
    if (middleName && middleName.length > 0) {
        return middleName.charAt(0).toUpperCase() + ".";
    } else {
        return "";
    }
}

export function formatDate(d: any) {

    console.log('d', d)

    if (!d) {
        return ""
    }

    let date = d;
    if (!isNaN(d)) {
        date = Number(d) < 10000000000 ? Number(d) * 1000 : Number(d);
    }

    // return moment(date).format('YYYY-MM-DD');
    return moment(date).format('DD MMM YYYY');
}

export function formatToValidHtmlDate(d: any): string {

    console.log('d', d)

    let date = d;
    if (!isNaN(d)) {
        date = Number(d) < 10000000000 ? Number(d) * 1000 : Number(d);
    }

    return moment(date).format('YYYY-MM-DD')

}

export function isValidDate(dateString: string | null): boolean {

    if (!dateString) {
        return false
    }

    // Parse the date string
    let date = new Date(dateString);

    // Check if the parsed date is a valid date
    return !isNaN(date.getTime());
}

export function formatToPhpCurrency(number: number) {
    return "₱" + number.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function getVatAmount(price: number, vat_type: VAT_TYPE) {

    if (!price) return 0

    if (vat_type === VAT_TYPE.EXC) {
        return price * VAT_RATE
    }

    if (vat_type === VAT_TYPE.INC) {
        return (price * VAT_RATE) / (1 + VAT_RATE);
    }

    return 0

}

export function getNetPrice(payload: { grossPrice: number, vatAmount: number }) {
    const { grossPrice, vatAmount } = payload

    return (grossPrice - vatAmount)

}

export function getTotalNetPrice(payload: { pricePerUnit: number, quantity: number, vatPerUnit: number }) {

    const { pricePerUnit, quantity, vatPerUnit } = payload

    const totalPrice = pricePerUnit * quantity
    const totalVat = vatPerUnit * quantity

    return (totalPrice - totalVat)

}

export function getVatTotal(payload: { price: number, quantity: number, vatType: VAT_TYPE }) {

    const { price, quantity, vatType } = payload
    const vatPerUnit = getVatAmount(price, vatType)
    return vatPerUnit * quantity

}

export function getGrossTotal(payload: { price: number, quantity: number }) {
    const { price, quantity } = payload

    return (price * quantity)

}