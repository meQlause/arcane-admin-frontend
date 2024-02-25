const CORE_BADGE_RESOURCE_ADDRESS =
  "resource_tdx_2_1ngen5nkjnfdg4r2t7dfy76dtlru7x6y2w3pktk7xdkxl3h97j7atxw";
const ADMIN_BADGE_RESOURCE_ADDRESS =
  "resource_tdx_2_1n2t6xxxren726apmuq4nsuchany682ag93a26zysp8sduslzyqmynt";
const MEMBER_BADGE_RESOURCE_ADDRESS =
  "resource_tdx_2_1nfdlwjnrxsaxgnkudh0tn46zfuyyek75f3xaqhdyh66ysrna0yaer2";
const COMPONENT_ADDRESS =
  "component_tdx_2_1cpcp75rfh3dujcwuk69eanrxna5xevnem4vpa0lgtd8tg6d2us2lcv";
const ARC_RESOURCE_ADDRESS =
  "resource_tdx_2_1tk2zhlv50l4nl5flx2qc2y0zavp65xwt8khufun3kmq7xh90896gvc";

export function signUpMember(address: string): string {
  return `
    CALL_METHOD
        Address("${COMPONENT_ADDRESS}")
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
        Address("${CORE_BADGE_RESOURCE_ADDRESS}")
        Array<NonFungibleLocalId>(
            NonFungibleLocalId("#1#")
        )
    ;
    CALL_METHOD
        Address("${COMPONENT_ADDRESS}")
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
        Address("${CORE_BADGE_RESOURCE_ADDRESS}")
        Array<NonFungibleLocalId>(
            NonFungibleLocalId("#1#")
        )
    ;

    RECALL_NON_FUNGIBLES_FROM_VAULT 
        Address("${vaultAddress}") 
        Array<NonFungibleLocalId>(
            NonFungibleLocalId("${NFT_ID}")
        )
    ;

    TAKE_ALL_FROM_WORKTOP
        Address("${ADMIN_BADGE_RESOURCE_ADDRESS}")
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
    Address("${MEMBER_BADGE_RESOURCE_ADDRESS}")
    Array<NonFungibleLocalId>(
        NonFungibleLocalId("${nftId}")
    )
  ;

  POP_FROM_AUTH_ZONE
      Proof("nft_proof")
  ;

  CALL_METHOD
      Address("${COMPONENT_ADDRESS}")
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
      Address("${ARC_RESOURCE_ADDRESS}")
      Decimal("${amount}") 
    ;

    TAKE_FROM_WORKTOP
      Address("${ARC_RESOURCE_ADDRESS}")
      Decimal("${amount}")
      Bucket("my_bucket")
    ;

    CALL_METHOD
        Address("${address}")
        "create_proof_of_non_fungibles"
        Address("${MEMBER_BADGE_RESOURCE_ADDRESS}")
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

export function withdraw(
  address: string,
  nft_id: string,
  componentAddressVote: string,
  key: string
): string {
  return `
  CALL_METHOD
    Address("${address}")
    "create_proof_of_non_fungibles"
    Address("${MEMBER_BADGE_RESOURCE_ADDRESS}")
    Array<NonFungibleLocalId>(
        NonFungibleLocalId("${nft_id}")
    )
  ;
  POP_FROM_AUTH_ZONE
      Proof("proof1")
  ;
  CALL_METHOD
      Address("${componentAddressVote}")
      "withdraw"
      Proof("proof1")
      "${key}"
  ;
  CALL_METHOD
      Address("${address}")
      "try_deposit_batch_or_refund"
      Expression("ENTIRE_WORKTOP")
      Enum<0u8>()
  ;
  `;
}

export function mint_arc(address: string): string {
  return `
  CALL_METHOD
    Address("${COMPONENT_ADDRESS}")
    "mint_token"
  ;
  CALL_METHOD
      Address("${address}")
      "try_deposit_batch_or_refund"
      Expression("ENTIRE_WORKTOP")
      Enum<0u8>()
  ;`;
}
