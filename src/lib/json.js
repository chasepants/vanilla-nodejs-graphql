/**
 * Safely parses a string into json. 
 * If the string is malformed an empty body will be returned. 
 * 
 * @param str 
 * @returns 
 */
export function stringToJson(str) {
    try {
        return JSON.parse(str);
    } catch(error) {
        console.error(error);
        return {};
    }
}