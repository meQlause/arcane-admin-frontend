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
  arcaneVoteStyle: string;
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
        "account_tdx_2_1293z892mr8wx3ga73zlrfwmlakx38te882yjfe2ehuxhk5z2cgp8rc",
      arcaneMain:
        "component_tdx_2_1cqcthsh4906ntr59hweffm5zprmf692522dhyk6gastl38kdrche8t",
      arcaneVoteStyle:
        "package_tdx_2_1p4trqhttcancga3c9wg3zyg2v7qey7uztuya3vvp9rh3c0feehj73f",
      arcaneBadge:
        "resource_tdx_2_1nt7wuwezckc7xjpxyyhys2et8v754w925kpzrxq8st0ue62nzurdqx",
      arcaneCoreBadge:
        "resource_tdx_2_1nt8n54ttjtdantt8eulk4f0v4s7jjgfzazrm7vkhrye8k895e43hsd",
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
        "account_tdx_2_1293z892mr8wx3ga73zlrfwmlakx38te882yjfe2ehuxhk5z2cgp8rc",
      arcaneMain:
        "component_tdx_2_1cqcthsh4906ntr59hweffm5zprmf692522dhyk6gastl38kdrche8t",
      arcaneVoteStyle:
        "package_tdx_2_1p4trqhttcancga3c9wg3zyg2v7qey7uztuya3vvp9rh3c0feehj73f",
      arcaneBadge:
        "resource_tdx_2_1nt7wuwezckc7xjpxyyhys2et8v754w925kpzrxq8st0ue62nzurdqx",
      arcaneCoreBadge:
        "resource_tdx_2_1nt8n54ttjtdantt8eulk4f0v4s7jjgfzazrm7vkhrye8k895e43hsd",
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
