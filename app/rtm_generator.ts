import config from "@/app/config";

export class RTMGenerator {
  constructor() {}

  static signUp(address: string): string {
    return `
    CALL_METHOD
      Address("${address}")
      "withdraw"
      Address("resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc")
      Decimal("0") 
    ;
    
    CALL_METHOD
        Address("${config.addresses.arcaneMain}")
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
        Address("${config.addresses.arcaneCoreBadge}")
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
        Address("${config.addresses.arcaneBadge}")
        Bucket("nft")
    ;
      
    CALL_METHOD
        Address("${config.addresses.arcaneMain}")
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
        Address("${config.addresses.arcaneBadge}")
        Array<NonFungibleLocalId>(
            NonFungibleLocalId("#${nftId}#")
        )
    ;
      
    POP_FROM_AUTH_ZONE
      Proof("nft_proof")
    ;
      
    CALL_METHOD
      Address("${config.addresses.arcaneMain}")
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
      Address("${config.addresses.arcaneBadge}")
      Array<NonFungibleLocalId>(
          NonFungibleLocalId("${nftId}")
      )
    ;
  
    POP_FROM_AUTH_ZONE
        Proof("nft_proof")
    ;
  
    CALL_METHOD
        Address("${config.addresses.arcaneMain}")
        "create_vote"
        Proof("nft_proof")
        Address("${config.addresses.arcaneVoteStyle}")
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
        Address("${config.addresses.ARC}")
        Decimal("${amount}") 
      ;
  
      TAKE_FROM_WORKTOP
        Address("${config.addresses.ARC}")
        Decimal("${amount}")
        Bucket("arc_bucket")
      ;
  
      CALL_METHOD
          Address("${address}")
          "create_proof_of_non_fungibles"
          Address("${config.addresses.arcaneBadge}")
          Array<NonFungibleLocalId>(
              NonFungibleLocalId("${nft_id}")
          )
      ;
          
      POP_FROM_AUTH_ZONE
          Proof("nft_proof")
      ;
          
      CALL_METHOD
        Address("${config.addresses.arcaneMain}")
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
      Address("${config.addresses.arcaneBadge}")
      Array<NonFungibleLocalId>(
          NonFungibleLocalId("${nft_id}")
      )
    ;
    POP_FROM_AUTH_ZONE
        Proof("nft_proof")
    ;
        
    CALL_METHOD
        Address("${config.addresses.arcaneMain}")
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
      Address("${config.addresses.ARC}")
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
