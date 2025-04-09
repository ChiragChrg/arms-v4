/**
 * Formats a date string or Date object into a human-readable format.
 * @param inputDate - The date to format (string or Date object).
 * @param locale - The locale for formatting (default is 'en-US').
 * @param options - Intl.DateTimeFormat options for customizing the format.
 * @returns Formatted date string or 'Invalid Date' if the input is invalid.
 */
export const formatDate = (
    inputDate: string | Date | undefined | null,
    locale: string = 'en-US',
    options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
): string => {
    if (!inputDate) return 'Invalid Date';

    const date = typeof inputDate === 'string' ? new Date(inputDate) : inputDate;

    return isNaN(date.getTime()) ? 'Invalid Date' : new Intl.DateTimeFormat(locale, options).format(date);
};
