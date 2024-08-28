import { Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts"
import { Count, NFT, Order } from "../../../generated/schema"
import * as categories from "../category/categories"
import { ONE_MILLION } from "../util"

export const DEFAULT_ID = "DEFAULT_ID"

export function buildCount(): Count {
    let count = Count.load(DEFAULT_ID)
    
    if (count == null) {
        count = new Count(DEFAULT_ID)
        count.orderTotal = BigInt.fromI32(0)
        count.orderCharacterTotal = BigInt.fromI32(0)
        count.orderTreasureTotal =BigInt.fromI32(0)
        count.orderItemTotal = BigInt.fromI32(0)
        count.characterTotal =BigInt.fromI32(0)
        count.treasureTotal =BigInt.fromI32(0)
        count.itemTotal = BigInt.fromI32(0)
        count.characterStarted = BigInt.fromI32(0)
        count.itemStarted = BigInt.fromI32(0)
        count.salesTotal = BigInt.fromI32(0)
        count.creatorEarningTotal = BigInt.fromI32(0)
        count.daoEarningTotal = BigInt.fromI32(0)
    }

    return count as Count
}

export function buildCountFromNFT(nft: NFT): Count {
    let category = nft.category
    let count = buildCount()

    if (category == categories.CHARACTER) {
        count.characterTotal = count.characterTotal.plus(BigInt.fromI32(1))
    }
    else if (category == categories.TREASURE) {
        count.treasureTotal = count.treasureTotal.plus(nft.amount)
    }
    else if (category == categories.ITEM) {
        count.itemTotal = count.itemTotal.plus(BigInt.fromI32(1))
    }

    return count as Count
}

export function buildCountFromSale(price: BigInt, feesCollectorCut: BigInt): Count {
    let count = buildCount()
    count.salesTotal = count.salesTotal.plus(BigInt.fromI32(1))
    count.creatorEarningTotal = count.creatorEarningTotal.plus(price.minus(feesCollectorCut))
    count.daoEarningTotal = count.daoEarningTotal.plus(
        feesCollectorCut.times(price).div(ONE_MILLION)
    )

    return count as Count
}

export function buildCountFromOrder(order: Order): Count {
    let category = order.category
    let count = buildCount()
    count.orderTotal = count.orderTotal.plus(BigInt.fromI32(1))

    switch(category) {
        case categories.CHARACTER:
            count.orderCharacterTotal = count.orderCharacterTotal.plus(BigInt.fromI32(1))
            break
        case categories.TREASURE:
            count.orderTreasureTotal = count.orderTreasureTotal.plus(BigInt.fromI32(1))
            break
        case categories.ITEM:
            count.orderItemTotal = count.orderItemTotal.plus(BigInt.fromI32(1))
            break
        default:
    }

    return count as Count
}