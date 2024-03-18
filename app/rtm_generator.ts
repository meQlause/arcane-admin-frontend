const CORE_BADGE_RESOURCE_ADDRESS =
  "resource_tdx_2_1ng4xhqj2vjczp8xzf5v5f5d76xc4dkg54src0uhwzkd8wp3gzkmwzu";
const ADMIN_BADGE_RESOURCE_ADDRESS =
  "resource_tdx_2_1ngmp8e3zasngr9u5c9kqp543vsyfuv3skjm6q4f8tsx8ylv44g0ptj";
const MEMBER_BADGE_RESOURCE_ADDRESS =
  "resource_tdx_2_1nfxr3gc7zn3dut5dp3vv9z3mrhd6pntl5ty6sqnm8a8vv5nxszm49t";
const COMPONENT_ADDRESS =
  "component_tdx_2_1cqwe379ha8ds4nfls65a7e3a968w6ezc8zwmrlshg7apdug70dun5k";
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
