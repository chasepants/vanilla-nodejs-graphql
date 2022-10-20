export async function readInStreamAsString(stream) {
    let result = '';
    for await (const chunk of stream) {
        result += chunk;
    }
    return result;
}