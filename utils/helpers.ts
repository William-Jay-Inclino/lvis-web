import moment from "moment";


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

    let date = d;
    if (!isNaN(d)) {
        date = Number(d) < 10000000000 ? Number(d) * 1000 : Number(d);
    }

    return moment(date).format('YYYY-MM-DD')

}