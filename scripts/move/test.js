require("dotenv").config();

const cli = require("@aptos-labs/ts-sdk/dist/common/cli/index.js");

async function test() {
  const move = new cli.Move();

  await move.test({
    packageDirectoryPath: "move",
    namedAddresses: {
      aptosaver_addr: "0x6bb503ba74833ea9f796423285e51e2c4981747e862cd899ed622efdca73ef6e",
    },
  });
}
test();
