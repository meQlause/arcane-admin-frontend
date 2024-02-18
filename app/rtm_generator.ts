const coreBadgeResourceAddress: string =
  "resource_tdx_2_1ngc8748dj05ha2mut2f545vz4cf9d9fuxsauz34dtrkg48xr95rj7v";
const adminBadgeResourceAddress: string =
  "resource_tdx_2_1n2dpnpcam29rhxd477c2ap3dsznmx452trpd2v5et8vpw6h0sm932e";
const memberBadgeResourceAddress: string =
  "resource_tdx_2_1nghgsmxdklt73ps3fdfwv3q88x7xftxwwjatlf2adrzaryxpdxhu9j";
const componentAddress: string =
  "component_tdx_2_1cpfzgcnc7dt6pgpd6scdftfg9trzk0l9j6vv3ndwt7e7k2yw4hvz5q";
const xrd: string =
  "resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc";
export function signUpMember(address: string): string {
  return `
    CALL_METHOD
        Address("${componentAddress}")
        "sign_up"
    ;
    CALL_METHOD
        Address("${address}")
        "try_deposit_batch_or_refund"
        Expression("ENTIRE_WORKTOP")
        Enum<0u8>()
    ;
    `;
}

export function signUpAdmin(addressCore: string, addressAdmin: string): string {
  return `
    CALL_METHOD
        Address("${addressCore}")
        "create_proof_of_non_fungibles"
        Address("${coreBadgeResourceAddress}")
        Array<NonFungibleLocalId>(
            NonFungibleLocalId("#1#")
        )
    ;
    CALL_METHOD
        Address("${componentAddress}")
        "make_admin"
    ;

    CALL_METHOD
        Address("${addressAdmin}")
        "try_deposit_batch_or_refund"
        Expression("ENTIRE_WORKTOP")
        Enum<0u8>()
    ;
    `;
}

export function recallAdminBadge(
  addressCore: string,
  vaultAddress: string,
  NFT_ID: string
) {
  return `
    CALL_METHOD
        Address("${addressCore}")
        "create_proof_of_non_fungibles"
        Address("${coreBadgeResourceAddress}")
        Array<NonFungibleLocalId>(
            NonFungibleLocalId("{df20666fa828d497-523a92552c997504-1c7d6a7ee570fe77-9fff609f27b967ab}")
        )
    ;

    RECALL_NON_FUNGIBLES_FROM_VAULT 
        Address("${vaultAddress}") 
        Array<NonFungibleLocalId>(
            NonFungibleLocalId("${NFT_ID}")
        )
    ;

    TAKE_ALL_FROM_WORKTOP
        Address("${adminBadgeResourceAddress}")
        Bucket("admin_badge")
    ;
    
    BURN_RESOURCE
        Bucket("admin_badge");
    `;
}

export function createVote(
  address: string,
  nftId: string,
  votes: string[]
): string {
  return `
  CALL_METHOD
    Address("${address}")
    "create_proof_of_non_fungibles"
    Address("${memberBadgeResourceAddress}")
    Array<NonFungibleLocalId>(
        NonFungibleLocalId("${nftId}")
    )
  ;

  POP_FROM_AUTH_ZONE
      Proof("nft_proof")
  ;

  CALL_METHOD
      Address("${componentAddress}")
      "create_vote"
      Proof("nft_proof")
      1u64
      Array<String>(${votes.map((item) => `"${item}"`).join(", ")})
  ;
  `;
}

export function addVote(
  address: string,
  amount: string,
  nft_id: string,
  componentVoteAddress: string,
  key: string
): string {
  return `
    CALL_METHOD
      Address("${address}")
      "withdraw"
      Address("${xrd}")
      Decimal("${amount}") 
    ;

    TAKE_FROM_WORKTOP
      Address("${xrd}")
      Decimal("${amount}")
      Bucket("my_bucket")
    ;

    CALL_METHOD
        Address("${address}")
        "create_proof_of_non_fungibles"
        Address("${memberBadgeResourceAddress}")
        Array<NonFungibleLocalId>(
            NonFungibleLocalId("${nft_id}")
        )
    ;
        
    POP_FROM_AUTH_ZONE
        Proof("nft_proof")
    ;
        
    CALL_METHOD
        Address("${componentVoteAddress}")
        "vote"
        Proof("nft_proof")
        "${key}"
        Bucket("my_bucket")
    ;`;
}
