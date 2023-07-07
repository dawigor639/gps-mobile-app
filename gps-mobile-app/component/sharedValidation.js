/** This module contains exported regular expressions and a function for validating numbers 
 * @module sharedValidation
 */
export const LATITUDE_REGEX = /^([-+]?((90(\.0+)?)|([1-8]?[0-9])(\.[0-9]+)?))$/;
export const LONGITUDE_REGEX = /^([-+]?((180(\.0+)?)|([1-8]?[0-9])(\.[0-9]+)?))$/;
export const RADIUS_REGEX = /^[0-9]{1,7}$/

export const UNIX_TIME_REGEX = /^([1-9][6-9][0-9]{8})$/;

export const NAME_REGEX = /^([a-zA-z0-9_]+)$/;
export const ADDRESS_REGEX = /^\+?[1-9][0-9]{7,14}$/;
export const PASSWORD_REGEX = /^[0-9]{18,22}$/;
export const INTERVAL_REGEX = /^[0-9]{3,5}$/;

export function validateNumber(text, type, regex, min, max) {
    let number = null;
    if (!regex.test(text))
        return false;

    if (type = "int")
        number = parseInt(text);
    else
        number = parseFloat(text);

    return ((number >= min) && (number <= max));
}

