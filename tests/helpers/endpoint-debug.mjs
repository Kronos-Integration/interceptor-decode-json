import { SendEndpoint, ReceiveEndpoint } from "../../src/module.mjs";

const owner = { name: "o" };
const r = new ReceiveEndpoint("r", owner);
r.receive = async arg => arg*arg;

const s = new SendEndpoint("s", owner, { connected: r });

s.send(3).then(result => {
    console.log(result);
});
