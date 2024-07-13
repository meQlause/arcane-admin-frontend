import * as dotenv from "dotenv";

dotenv.config();

const mode = `${process.env.NEXT_PUBLIC_MODE}`;
if (!mode) throw new Error("Mode must be set");
console.log(mode);
if (!["mainnet", "public_stokenet", "dev_stokenet"].includes(mode)) {
  throw new Error("Invalid mode: " + mode);
}

export type addresses = {
  dappsDefinition: string;
  arcaneMain: string;
  arcaneMainPackage: string;
  arcaneReward: string;
  arcaneRewardStylePackage: string;
  arcaneVoteStylePackage: string;
  arcaneBadge: string;
  arcaneCoreBadge: string;
  ARC: string;
};

export type apis = {
  // NEXT_PUBLIC_BACKEND_API_SERVER = https://172.19.101.83:4001
  // NEXT_PUBLIC_GATEWAY_API_URL=https://stokenet.radixdlt.com/state/entity/page/fungibles/
  // NEXT_PUBLIC_RADIX_DAPPS_DEFINITION_ADDRESS=account_tdx_2_1293z892mr8wx3ga73zlrfwmlakx38te882yjfe2ehuxhk5z2cgp8rc
  NEXT_PUBLIC_BACKEND_API_SERVER: string;
  NEXT_PUBLIC_GATEWAY_API_URL: string;
};

const arcaneConfig = {
  public_stokenet: {
    addresses: {
      dappsDefinition:
        "account_tdx_2_129wsptp9d7fdrj7pqgpnwv59k2q9ywc2cy38047peha5axkgugrvkc", //
      arcaneMain:
        "component_tdx_2_1crnqyuw4cp923cmz7lafkzuq5zzy2e8wkpf9c90dym9343hv87ttuz", //
      arcaneMainPackage:
        "package_tdx_2_1p5d32ee2lzcqzfz6chee7xc9sp6wlv745dey55qt7jwpj9u53ltktt", //
      arcaneReward:
        "component_tdx_2_1cq5g5pl40zrh057rtte6t9ta0cprcn06z592fmedpwnuv2vtud8yhk", //
      arcaneRewardStylePackage:
        "package_tdx_2_1p58ua43h36suwelpv7rgf5va644vrcsq6tttnh08qpvtae8ywnu4yt", //
      arcaneVoteStylePackage:
        "package_tdx_2_1p4dn6lfthzegj95n5ku2mgd4vtvxlxe0hx4cvuvxjqd9jw9dptwje5", //
      arcaneBadge:
        "resource_tdx_2_1nfyuwrfm07kr78fhxhdut2vhhfrz64cgfhkn2j6p2yyg6vaklk35ga", //
      arcaneCoreBadge:
        "resource_tdx_2_1ngck4w3206djlz9vxma8vx82upsfqzrn29v7myfu67fvhlklq8973r", //
      ARC: "resource_tdx_2_1tk08g7ulr5lp0lmm66me4gvzqp5dpq0dg84t8k78wlmacz7agwl8rs",
    } satisfies addresses,
    apis: {
      NEXT_PUBLIC_BACKEND_API_SERVER: "https://arcanedev.site:4001",
      NEXT_PUBLIC_GATEWAY_API_URL:
        "https://stokenet.radixdlt.com/state/entity/page/fungibles/",
    } satisfies apis,
  },
  dev_stokenet: {
    addresses: {
      dappsDefinition:
        "account_tdx_2_12xzlmnujxlzkwhpk6efeeg3a7dsjqj7wtdv39psu9uzdqalnukkame",
      arcaneMain:
        "component_tdx_2_1czcqc450rvkrz9ly7t7rj6lpj3usd2nzkvm3nctywfmsnqz88t7406",
      arcaneMainPackage:
        "package_tdx_2_1p5fpdjl0hddqaczz4kgwrywh03jgy394y9r0tla8fs3ytukvc66wp8",
      arcaneReward:
        "component_tdx_2_1cppfnlsz23fnh06y7vrtuue2waqusmh38p040af9ue42kt65haca90",
      arcaneRewardStylePackage:
        "package_tdx_2_1phqmyswq5u3r3sffcmxccknkwmxaear55gqclanrcz7j8plpfd4e9p",
      arcaneVoteStylePackage:
        "package_tdx_2_1pke2ehp9jrc8lym9vyk27trxvylqqx29kycrxjugcrfgn6cf59gn9u",
      arcaneBadge:
        "resource_tdx_2_1n2f8uyhay45rdnfmjxc8x60jcpzp6rzzul9xd0se7gmdupjz8ctgug",
      arcaneCoreBadge:
        "resource_tdx_2_1ntptr9sqmgdtr46z6fdz67945xc446lfvds9tw8p2nm4zk4znka7dq",
      ARC: "resource_tdx_2_1tk08g7ulr5lp0lmm66me4gvzqp5dpq0dg84t8k78wlmacz7agwl8rs",
    } satisfies addresses,
    apis: {
      NEXT_PUBLIC_BACKEND_API_SERVER: "https://172.18.116.39:4001",
      NEXT_PUBLIC_GATEWAY_API_URL:
        "https://stokenet.radixdlt.com/state/entity/page/fungibles/",
    } satisfies apis,
  },
}[mode]!;

const config = { mode, ...arcaneConfig };
export default config;
