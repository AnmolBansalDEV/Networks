import fs from "fs";

const getAdresses = async (path: string) => {
  return fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    let genesis = JSON.parse(data);
    let auth_account_addresses: string[] = [];
    genesis["app_state"]["auth"]["accounts"].forEach((account: any) => {
      auth_account_addresses.push(account["address"]);
    });
    fs.writeFile(
      "auth_account_addresses.json",
      JSON.stringify(auth_account_addresses),
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("File has been created");
      }
    );
  });
};

getAdresses("cataclysm-1/genesis.json");

function monitor_address(addresses: string[]) {
  addresses.forEach((address) => {
    console.log(address);
  });
}
