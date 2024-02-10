const coreBadgeResourceAddress: string =
  "resource_tdx_2_1nfmlrvgdjw96nu6jz3ud4x5pha6trk6444f53gfwut475jpc04cyre";
const adminBadgeResourceAddress: string =
  "resource_tdx_2_1nf5kylgmll0pqn6ee0qa8hntx0npegddzp674x90r9tjucjndl8nwx";
const componentAddress: string =
  "component_tdx_2_1cpxy9e08cmprdda88dhjtv5wl0jes0zg8unp69wxhra7drx38fm3xv";
export function signUpMember(address: string): string {
  return `
    CALL_METHOD
        Address("component_tdx_2_1cpxy9e08cmprdda88dhjtv5wl0jes0zg8unp69wxhra7drx38fm3xv")
        "mint_member"
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
            NonFungibleLocalId("{df20666fa828d497-523a92552c997504-1c7d6a7ee570fe77-9fff609f27b967ab}")
        )
    ;
    CALL_METHOD
        Address("${componentAddress}")
        "mint_admin"
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
