import { createServer } from 'http';
import { requestListener } from './graphql/server.js';

const server = createServer(requestListener);
const port = process.env.port || 8080;
server.listen(port);
