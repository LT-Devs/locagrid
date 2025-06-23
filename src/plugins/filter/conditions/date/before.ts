import { LogicFunction } from '../../filter.types';

/**
 * Filter function to check if a date is before the given value
 * For ISO format dates like "2023-03-15T12:30:45.000Z"
 */
const before: LogicFunction = (value: any, compareWith?: any) => {
    // If no values to compare, filter passes everything
    if (!value || !compareWith) {
        return false;
    }

    try {
        // Convert both values to Date objects
        const valueDate = new Date(value);
        const compareDate = new Date(compareWith);

        // Check if dates are valid
        if (isNaN(valueDate.getTime()) || isNaN(compareDate.getTime())) {
            return false;
        }

        // Compare dates (without time part)
        const d1 = new Date(valueDate.getFullYear(), valueDate.getMonth(), valueDate.getDate());
        const d2 = new Date(compareDate.getFullYear(), compareDate.getMonth(), compareDate.getDate());

        // Value date should be before compare date
        return d1.getTime() <= d2.getTime();
    } catch (e) {
        console.error('Date before filter error:', e);
        return false;
    }
};

// Set extra property to 'datepicker' so the filter knows to use a datepicker
before.extra = 'datepicker';

export default before; 