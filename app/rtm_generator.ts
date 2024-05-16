const arcaneMain =
  "component_tdx_2_1cqcthsh4906ntr59hweffm5zprmf692522dhyk6gastl38kdrche8t";
const arcaneVoteStyle =
  "package_tdx_2_1p4trqhttcancga3c9wg3zyg2v7qey7uztuya3vvp9rh3c0feehj73f";
const arcaneBadge =
  "resource_tdx_2_1nt7wuwezckc7xjpxyyhys2et8v754w925kpzrxq8st0ue62nzurdqx";
const arcaneCoreBadge =
  "resource_tdx_2_1nt8n54ttjtdantt8eulk4f0v4s7jjgfzazrm7vkhrye8k895e43hsd";
const ARC =
  "resource_tdx_2_1tk08g7ulr5lp0lmm66me4gvzqp5dpq0dg84t8k78wlmacz7agwl8rs";

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
