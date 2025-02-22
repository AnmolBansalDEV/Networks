import Fastify from 'fastify';
import fs from "fs";
import { getAdresses, monitor_address } from './utils';

const server = Fastify({ logger: true });

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.get('/balances', async (request, reply) => {
  try {
    const data = await fs.promises.readFile("auth_account_addresses.json", "utf8");
    const addresses = JSON.parse(data);
    const balances = await monitor_address(addresses);
    return reply.code(200).send(balances);
  } catch (err) {
    console.error(err);
    return reply.code(500).send({ error: "Internal Server Error" });
  }
});

server.get('/addresses', async (request, reply) => {
  try {
    const addresses = await getAdresses("cataclysm-1/genesis.json");
    return reply.code(200).send(addresses);
  } catch (err) {
    console.error(err);
    return reply.code(500).send({ error: "Internal Server Error" });
  }
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})