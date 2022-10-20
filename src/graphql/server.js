import { graphql, buildSchema } from 'graphql';
import { schema } from './schema.js';
import { resolvers } from './resolvers.js';
import { readInStreamAsString } from '../lib/streams.js';
import { stringToJson } from '../lib/json.js';
import { INTERNAL_SERVER_ERROR, INVALID_REQUEST, RESOURCE_NOT_FOUND, VALID_RESPONSE } from '../lib/http.js';


export const requestListener = async function(req, res) {
    if (req.url === "/graphql" && (req.method === "GET" || req.method === "POST")) {
        const json = await validateJsonInRequest(req);
        if (!json) {
            res.writeHead(INVALID_REQUEST.code);
            res.end(INVALID_REQUEST);   
        }
        const response = await graphqlHandler(json);
        
        if (!response || !response.data) {
            res.writeHead(INTERNAL_SERVER_ERROR.code);
            res.end(INTERNAL_SERVER_ERROR.message);
        }

        res.writeHead(VALID_RESPONSE.code);
        res.end(JSON.stringify(response.data));
        return;
    }

    res.writeHead(RESOURCE_NOT_FOUND.code);
    res.end(RESOURCE_NOT_FOUND);    
}

/**
 * Resolve graphql query
 * 
 * @param json 
 * @returns 
 */
const graphqlHandler = async function(json) {
    const graphqlArgs = {
        source: json.query,
        schema:  buildSchema(schema),
        rootValue: resolvers  
    }

    return await graphql(graphqlArgs);
} 

/**
 * Get the body out of the request
 * Validate there is a query field in the json
 * 
 * @param req 
 * @returns 
 */
const validateJsonInRequest = async (req) => {
    const body = await readInStreamAsString(req);
    const json = stringToJson(body);
    return json.query ? json : null;
}