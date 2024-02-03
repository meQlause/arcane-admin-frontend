export function signUp(address: string) : string {
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