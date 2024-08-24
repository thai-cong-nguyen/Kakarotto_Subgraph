import { Address, BigInt } from "@graphprotocol/graph-ts"
import { Account, TreasureAccount } from "../../../generated/schema"
import { getTreasureId } from "../treasure"
import { KakarottoTreasure as KakarottoTreasureABI } from "../../../generated/KakarottoTreasure/KakarottoTreasure"
import { createOrLoadAccount } from "../account"

export function getTreasureAccountId(contractAddress: Address, tokenId: BigInt, account: Address): string {
    return account.toHexString() + "-" + contractAddress.toHexString() + "-" + tokenId.toString()
}

export function createOrLoadTreasureAccount(contractAddress: Address, accountAddress: Address, tokenId: BigInt): TreasureAccount {
    const id = getTreasureAccountId(contractAddress, tokenId, accountAddress)
    let treasureAccount = TreasureAccount.load(id)
    if (treasureAccount == null) {
        treasureAccount = new TreasureAccount(id)
        treasureAccount.treasure = getTreasureId(contractAddress, tokenId)
        treasureAccount.balance = BigInt.fromI32(0)
        treasureAccount.save()
    }
    return treasureAccount
}