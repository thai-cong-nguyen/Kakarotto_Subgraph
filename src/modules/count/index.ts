import { Bytes, BigInt } from "@graphprotocol/graph-ts"
import { Count, NFT, Order } from "../../../generated/schema"
import * as categories from "../category/categories"
import { ONE_MILLION } from "../util"

export const DEFAULT_ID = "DEFAULT_ID"

export function buildCount(): Count {
    let count = Count.load(DEFAULT_ID)
    
    if (count == null) {
        count = new Count(DEFAULT_ID)
        count.orderTotal = 0
        count.orderCharacterTotal = 0
        count.orderTreasureTotal =0
        count.orderItemTotal = 0
        count.characterTotal =0
        count.treasureTotal =0
        count.itemTotal = 0
        count.started = 0
        count.salesTotal = 0
        count.creatorEarningTotal = BigInt.fromI32(0)
        count.daoEarningTotal = BigInt.fromI32(0)
    }

    return count as Count
}

export function buildCountFromNFT(nft: NFT): Count {
    let category = nft.category
    let count = buildCount()

    switch (category) {
        case categories.CHARACTER:
            count.characterTotal += nft.amount
            break
        case categories.TREASURE:
            count.treasureTotal += nft.amount
            break
        case categories.ITEM:
            count.itemTotal += nft.amount
            break
        default:
            break
    }

    return count as Count
}

export function buildCountFromSale(price: BigInt, feesCollectorCut: BigInt, amount: i32): Count {
    let count = buildCount()
    count.salesTotal = count.salesTotal + amount
    count.creatorEarningTotal = count.creatorEarningTotal.plus(price.minus(feesCollectorCut))
    count.daoEarningTotal = count.daoEarningTotal.plus(
        feesCollectorCut.times(price).div(ONE_MILLION)
    )

    return count as Count
}

export function buildCountFromOrder(order: Order): Count {
    let category = order.category
    let count = buildCount()
    count.orderTotal += 1

    switch(category) {
        case categories.CHARACTER:
            count.orderCharacterTotal += 1
            break
        case categories.TREASURE:
            count.orderTreasureTotal += 1
            break
        case categories.ITEM:
            count.orderItemTotal += 1
            break
        default:
    }

    return count as Count
}