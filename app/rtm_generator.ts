const arcaneMain =
  "component_tdx_2_1cr8g28hpxhxwx5q24aq7ugtpd0rtg5n8hep79j99w56469prsgdqh3";
const arcaneVoteStyle =
  "package_tdx_2_1p4c05m2t2aqzyv4zlq2th797hq8wql3527nye72xzzgfvwzs3zfx99";
const arcaneMainInstance =
  "component_tdx_2_1cr8g28hpxhxwx5q24aq7ugtpd0rtg5n8hep79j99w56469prsgdqh3";
const arcaneBadge =
  "resource_tdx_2_1ng4ahrcmujzvzmz40h527g0thyzm8wglq8uku2yn8lfcaptwfdzm9s";
const arcaneCoreBadge =
  "resource_tdx_2_1nfccyj7azztguyvw9jffhd2c394m6w0uhzpyz225jvyq8d2jt0up2n";
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
      Address("resource_tdx_2_1tk2zhlv50l4nl5flx2qc2y0zavp65xwt8khufun3kmq7xh90896gvc")
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
