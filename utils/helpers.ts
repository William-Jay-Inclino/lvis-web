import moment from "moment";
import { VAT_TYPE } from "#imports";

export function getFullname(firstname: string, middlename: string | null, lastname: string){
    if(middlename){
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

    if(!d) {
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

    if(!dateString) {
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

export function getVatPerUnit(price: number, vat_type: VAT_TYPE) {

    if(vat_type === VAT_TYPE.INC || vat_type === VAT_TYPE.NONE) return 0 

    const vatAmount = (price * VAT_RATE)

    return vatAmount

}

export function getTotalPrice(pricePerUnit: number, quantity: number, vatPerUnit: number) {

    const totalPrice = pricePerUnit * quantity 
    const totalVat = vatPerUnit * quantity 

    return (totalPrice + totalVat)

}