const arcaneMain =
  "component_tdx_2_1cz3qywv5hmnutpnp9jcku2tpgtuy6uajnaet0qq9y3rhvaulvthaxw";
const arcaneVoteStyle =
  "package_tdx_2_1pkjga85fmvxhmsncqukm6vmg8fhvrj9z3rgs3j52rp36kcpjc4l7ps";
const arcaneBadge =
  "resource_tdx_2_1n23f3q3s0wywk2749p7lyxpenqzj5qkq6xe3854hqs5j6jeqg436g4";
const arcaneCoreBadge =
  "resource_tdx_2_1ng3wstxykch30yhldq2u74gckeywaqzclcyce98p504sc7ndgvtk9m";
const ARC =
  "resource_tdx_2_1tk2zhlv50l4nl5flx2qc2y0zavp65xwt8khufun3kmq7xh90896gvc";

export class RTMGenerator {
  constructor() {}

  static signUp(address: string): string {
    return `
    CALL_METHOD
        Address("${arcaneMain}")
        "sign_up"
        Address("${address}")
    ;
    `;
  }

  static changeRoleTo(
    role: string,
    coreAddress: string,
    id: string,
    accountAddress: string,
    vaultAddress: string
  ): string {
    return `
    CALL_METHOD
        Address("${coreAddress}")
        "create_proof_of_non_fungibles"
        Address("${arcaneCoreBadge}")
        Array<NonFungibleLocalId>(
            NonFungibleLocalId("#0#")
        )
    ;
      
    RECALL_NON_FUNGIBLES_FROM_VAULT
        Address("${vaultAddress}")
        Array<NonFungibleLocalId>(
            NonFungibleLocalId("#${id}#"),
        )
    ;
      
    TAKE_ALL_FROM_WORKTOP
        Address("${arcaneBadge}")
        Bucket("nft")
    ;
      
    CALL_METHOD
        Address("${arcaneMain}")
        "change_role"
        Bucket("nft")
        "${role}"
    ;
      
    CALL_METHOD
        Address("${accountAddress}")
        "try_deposit_batch_or_refund"
        Expression("ENTIRE_WORKTOP")
        Enum<0u8>()
    ;
    `;
  }

  static changeProposalStatusTo(
    status: boolean,
    proposalAddress: string,
    accountAddress: string,
    nftId: string
  ): string {
    return `
      CALL_METHOD
        Address("${accountAddress}")
        "create_proof_of_non_fungibles"
        Address("${arcaneBadge}")
        Array<NonFungibleLocalId>(
            NonFungibleLocalId("#${nftId}#")
        )
    ;
      
    POP_FROM_AUTH_ZONE
      Proof("nft_proof")
    ;
      
    CALL_METHOD
      Address("${arcaneMain}")
      "set_status"
      Proof("nft_proof")
      Address("${proposalAddress}")
      ${status}
    ;
    `;
  }
  static createVote(
    address: string,
    nftId: string,
    votes: string[],
    id: string,
    duration: string
  ): string {
    return `
    CALL_METHOD
      Address("${address}")
      "create_proof_of_non_fungibles"
      Address("${arcaneBadge}")
      Array<NonFungibleLocalId>(
          NonFungibleLocalId("${nftId}")
      )
    ;
  
    POP_FROM_AUTH_ZONE
        Proof("nft_proof")
    ;
  
    CALL_METHOD
        Address("${arcaneMain}")
        "create_vote"
        Proof("nft_proof")
        Address("${arcaneVoteStyle}")
        "${id}"
        ${duration}u8
        Array<String>(${votes.map((item) => `"${item}"`).join(", ")})
    ;
    `;
  }
  static vote(
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
        Address("${ARC}")
        Decimal("${amount}") 
      ;
  
      TAKE_FROM_WORKTOP
        Address("${ARC}")
        Decimal("${amount}")
        Bucket("arc_bucket")
      ;
  
      CALL_METHOD
          Address("${address}")
          "create_proof_of_non_fungibles"
          Address("${arcaneBadge}")
          Array<NonFungibleLocalId>(
              NonFungibleLocalId("${nft_id}")
          )
      ;
          
      POP_FROM_AUTH_ZONE
          Proof("nft_proof")
      ;
          
      CALL_METHOD
        Address("${arcaneMain}")
        "vote"
        Proof("nft_proof")
        Address("${componentVoteAddress}")
        "${key}"
        Bucket("arc_bucket")
;`;
  }
  static withdraw(
    address: string,
    nft_id: string,
    componentAddressVote: string
  ): string {
    return `
    CALL_METHOD
      Address("${address}")
      "create_proof_of_non_fungibles"
      Address("${arcaneBadge}")
      Array<NonFungibleLocalId>(
          NonFungibleLocalId("${nft_id}")
      )
    ;
    POP_FROM_AUTH_ZONE
        Proof("nft_proof")
    ;
        
    CALL_METHOD
        Address("${arcaneMain}")
        "withdraw"
        Proof("nft_proof")
        Address("${componentAddressVote}")
    ;
    CALL_METHOD
        Address("${address}")
        "try_deposit_batch_or_refund"
        Expression("ENTIRE_WORKTOP")
        Enum<0u8>()
    ;
    `;
  }
  static mint_arc(address: string): string {
    return `
    MINT_FUNGIBLE
      Address("${ARC}")
      Decimal("900")
    ;
    CALL_METHOD
        Address("${address}")
        "try_deposit_batch_or_refund"
        Expression("ENTIRE_WORKTOP")
        Enum<0u8>()
    ;`;
  }
}
