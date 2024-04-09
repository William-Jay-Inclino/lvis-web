import { jsPDF } from 'jspdf'
import type { Canvass } from './canvass.types';



export function generateCanvassPdf(item: Canvass) {
    console.log('generateCanvassPdf', item);

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: [8.50, 11.00]
    });

    // Set font size and style for the title
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');

    // Add title to the PDF and center it horizontally
    const title = 'LEYTE V ELECTRIC COOPERATIVE, INC.';
    const titleWidth = doc.getStringUnitWidth(title) * 10 / doc.internal.scaleFactor;
    const xTitle = (doc.internal.pageSize.width - titleWidth) / 2;
    doc.text(title, xTitle, 0.5);

    // Set font size for the small texts
    doc.setFontSize(8);

    // Calculate the y-coordinate for the small texts
    const yTexts = 0.5 + 0.15; // Title position + gap

    // Add small texts under the title and center them
    const address = 'Brgy. San Pablo, Ormoc City, Leyte';
    const tin = 'VAT REG. TIN 001-383-331-000';
    const addressWidth = doc.getStringUnitWidth(address) * 8 / doc.internal.scaleFactor;
    const tinWidth = doc.getStringUnitWidth(tin) * 8 / doc.internal.scaleFactor;
    const xAddress = (doc.internal.pageSize.width - addressWidth) / 2;
    const xTin = (doc.internal.pageSize.width - tinWidth) / 2;

    doc.setFont('helvetica', 'normal');

    doc.text(address, xAddress, yTexts); // Adjusted y-coordinate for address
    doc.text(tin, xTin, yTexts + 0.15); // Adjusted y-coordinate for tin

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');

    // Add margin top for the secondary title
    let marginTop = 0.50;
    const secondaryTitle = 'OFFICIAL CANVASS SHEET';
    const secondaryTitleWidth = doc.getStringUnitWidth(secondaryTitle) * 12 / doc.internal.scaleFactor;
    const xSecondaryTitle = (doc.internal.pageSize.width - secondaryTitleWidth) / 2;
    doc.text(secondaryTitle, xSecondaryTitle, yTexts + 0.3 + marginTop); // Adjusted y-coordinate for secondary title

    const dateRequested = '06 Apr 2024';
    // Add date text below the secondary title and align it to the left
    const dateText = `Date:      ${dateRequested}`; // Use your dynamic date variable here
    const dateTextWidth = doc.getStringUnitWidth(dateText) * 8 / doc.internal.scaleFactor;
    const xDateText = 0.5; // Left margin of 0.5 inch
    const yDateText = yTexts + 0.3 + marginTop + 0.2; // Adjusted y-coordinate for date text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(dateText, xDateText, yDateText);

    // Calculate the width of the "Date: " prefix
    const datePrefixWidth = doc.getStringUnitWidth('Date: ') * 8 / doc.internal.scaleFactor;

    // Adjust the start and end positions of the underline for less gap and longer underline
    const underlineStartX = xDateText + datePrefixWidth; // Start of the underline
    const underlineEndX = underlineStartX + dateTextWidth + 0.1; // End of the underline
    const underlineY = yDateText + 0.05; // Y-coordinate of the underline, adjusted for less gap
    doc.setLineWidth(0.01); // Set the width of the underline to be thinner
    doc.line(underlineStartX, underlineY, underlineEndX, underlineY); // Draw the underline

    const rcNumber = '  24-00001'
    // Calculate the position for the second date text with margin
    const marginRight = 1.0; // Margin to the right
    const xSecondDateText = doc.internal.pageSize.width - dateTextWidth - marginRight; // Calculate the x-coordinate for the second date text
    doc.text(`RC #:      ${rcNumber}`, xSecondDateText, yDateText); // Use your dynamic date variable here

    // Calculate the width of the "Date: " prefix for the second date
    const secondDatePrefixWidth = doc.getStringUnitWidth('Date: ') * 8 / doc.internal.scaleFactor;

    // Adjust the start and end positions of the underline for the second date
    const secondUnderlineStartX = xSecondDateText + secondDatePrefixWidth; // Start of the underline for the second date
    const secondUnderlineEndX = secondUnderlineStartX + dateTextWidth + 0.1; // End of the underline for the second date
    doc.line(secondUnderlineStartX, underlineY, secondUnderlineEndX, underlineY); // Draw the underline for the second date













    // Save the PDF
    doc.save('canvass.pdf');
}




