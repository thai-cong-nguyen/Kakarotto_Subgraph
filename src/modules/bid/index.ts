import { Address, BigInt } from "@graphprotocol/graph-ts"

export function getBidId(
    contractAddress: Address,
    tokenId: BigInt,
    bidder: Address
): string {
    return contractAddress.toHexString() + "-" + tokenId.toString() + "-" + bidder.toHexString()
}