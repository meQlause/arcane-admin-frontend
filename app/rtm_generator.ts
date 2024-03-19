const CORE_BADGE_RESOURCE_ADDRESS =
  "resource_tdx_2_1n20fntprpwav2hssr4xtuyljdcrnl7pkhl4l4f8l09shjm9gs5ywr8";
const ADMIN_BADGE_RESOURCE_ADDRESS =
  "resource_tdx_2_1n20s88r6c9a4y4ufuws3e5dn28fkee0xgzqama3d4p0tnw5dcksd2p";
const MEMBER_BADGE_RESOURCE_ADDRESS =
  "resource_tdx_2_1nt8ze7dfwnduzgxth56q5lfrf3l0snya5qdszjf5fw2j7evv9vhr76";
const COMPONENT_ADDRESS =
  "component_tdx_2_1cqnnsjstq8cv2t5n5y9r8xupfhpsnketxjmkg2numk4wzu8gur3wma";
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
            NonFungibleLocalId("#0#")
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
      "withdraw_vote"
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
  MINT_FUNGIBLE
    Address("${ARC_RESOURCE_ADDRESS}")
    Decimal("1000")
  ;
  CALL_METHOD
      Address("${address}")
      "try_deposit_batch_or_refund"
      Expression("ENTIRE_WORKTOP")
      Enum<0u8>()
  ;`;
}
