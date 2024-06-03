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
        "account_tdx_2_129wsptp9d7fdrj7pqgpnwv59k2q9ywc2cy38047peha5axkgugrvkc",
      arcaneMain:
        "component_tdx_2_1crf6yehtpum5w4yn96vr4f37dwcqs9w26fwtse5yw5736mvucpqkc0",
      arcaneMainPackage:
        "package_tdx_2_1pkwzvj9glkd5ngk5jsvmslm5f0y0lj6zldyp4mjnczlzgkm4yczczn",
      arcaneReward:
        "component_tdx_2_1cqujewcsuecd57qg2crncvu9m5tnvpmup2z4mjwlc5kwet79zezsl5",
      arcaneRewardStylePackage:
        "package_tdx_2_1p5cmh4f8t678trky3ajdfqtreqnfqaag3av88kq5ftkqn3h3zhqvut",
      arcaneVoteStylePackage:
        "package_tdx_2_1p49s7rpqhxqreaa0fdh5tjm48lqzqmgj22p2g7huq5fnt7gxzn67w3",
      arcaneBadge:
        "resource_tdx_2_1nfpez2d0ph7apyzj082egn7hf4dgnr8cujaffl0fnvecwd0wy4wxgd",
      arcaneCoreBadge:
        "resource_tdx_2_1n2448skp80k5ahl9s9q4yp3t50vkmxajjc0ml492nvqq6fel3lv8zp",
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
        "package_tdx_2_1pktzs0v7cfq82rct4s3uhy9l9kvrruhxf5f8jsqpjr7ss6kymz5lp0",
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
