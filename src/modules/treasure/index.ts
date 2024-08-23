import { Address, BigInt, log } from "@graphprotocol/graph-ts"
import * as rarities from '../nft/rarity'
import { TreasureAccount } from "../../../generated/schema"
import { createOrLoadTreasureAccount, getTreasureAccountId } from "../treasureAccount"
import { createOrLoadAccount } from "../account"

export function getTreasureRarity(
    contractAddress: Address,
    tokenId: BigInt
): string {
    switch (tokenId.toI32()) {
        case rarities.RarityEnum.BRONZE:
            return rarities.BRONZE
        case rarities.RarityEnum.SILVER:
            return rarities.SILVER
        case rarities.RarityEnum.GOLD:
            return rarities.GOLD
        case rarities.RarityEnum.PLATINUM:
            return rarities.PLATINUM
        case rarities.RarityEnum.DIAMOND:
            return rarities.DIAMOND
    }
    log.warning('Can not find rarity', [tokenId.toString(), contractAddress.toHexString()])
    return ""
}

export function getTreasureId(
    contractAddress: Address,
    tokenId: BigInt
) {
    return contractAddress.toHexString() + "-" + tokenId.toString()
}

export function trackTreasureBalance(
    contractAddress: Address,
    tokenId: BigInt,
    buyer: Address,
    seller: Address,
    amount: BigInt,
): void {
    const buyerId = getTreasureAccountId(contractAddress, tokenId, buyer)
    const sellerId = getTreasureAccountId(contractAddress, tokenId, seller)

    let buyerTreasureBalance = TreasureAccount.load(buyerId)
    let sellerTreasureBalance = TreasureAccount.load(sellerId)

    if (sellerTreasureBalance == null || sellerTreasureBalance.balance.lt(amount)) {
        log.warning('Not enough balance', [seller.toHexString()])
        return
    }

    if (buyerTreasureBalance == null) {
        buyerTreasureBalance = createOrLoadTreasureAccount(contractAddress, buyer, tokenId)
    }

    buyerTreasureBalance.balance = buyerTreasureBalance.balance.plus(amount)
    sellerTreasureBalance.balance = sellerTreasureBalance.balance.minus(amount)

    buyerTreasureBalance.save()
    sellerTreasureBalance.save()
}