import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"

export function getBidId(
    contractAddress: Address,
    tokenId: BigInt,
    bidder: Address
): string {
    return (changetype<Bytes>(contractAddress)).toHexString() + "-" + tokenId.toString() + "-" + (changetype<Bytes>(bidder)).toHexString()
}