import { NibiruQuerier } from "@nibiruchain/nibijs";
import fs from "fs";

export const getAdresses = async (path: string): Promise<string[]> => {
  try {
    const data = await fs.promises.readFile(path, "utf8");
    const genesis = JSON.parse(data);
    let auth_account_addresses: string[] = [];
    genesis["app_state"]["auth"]["accounts"].forEach((account: any) => {
      auth_account_addresses.push(account["address"]);
    });
    await fs.promises.writeFile(
      "auth_account_addresses.json",
      JSON.stringify(auth_account_addresses)
    );
    console.log("File has been created");
    return auth_account_addresses;
  } catch (err) {
    console.error(err);
    return [];
  }
};

// getAdresses("cataclysm-1/genesis.json");

export async function monitor_address(addresses: string[]) {
  const querier = await NibiruQuerier.connect("https://rpc.nibiru.fi:443");
  let result: Record<string, string>[] = [];

  await Promise.all(
    addresses.map(async (address) => {
      const balances = await querier.getAllBalances(address);
      result.push({ address: address, balances: JSON.stringify(balances) });
    })
  );

  return result;
}
