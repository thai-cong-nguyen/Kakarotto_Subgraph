import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { Count, NFT, Sale, AnalyticsDayData } from '../../../generated/schema'
import { buildCountFromSale } from "../count"
import { createOrLoadAccount } from "../account"
import { ONE_MILLION } from "../util"
import * as categories from "../category/categories"

export const BID_SALE_TYPE = 'bid'
export const ORDER_SALE_TYPE = 'order'

export function trackSale(
    type: string,
    buyer: Address,
    seller: Address,
    nftId: string,
    price: BigInt,
    feesCollectorCut: BigInt,
    timestamp: BigInt,
    transactionHash: Bytes
): void {
    if (price.isZero()) {
        return
    }

    let count = buildCountFromSale(price, feesCollectorCut)
    count.save()

    let nft = NFT.load(nftId)

    if (nft == null) {
        return
    }

    let saleId = count.salesTotal.toString()
    let sale = new Sale(saleId)
    sale.type = type
    sale.buyer = changetype<Bytes>(buyer)
    sale.seller = changetype<Bytes>(seller)
    sale.nft = nftId
    sale.amount = BigInt.fromI32(1)
    sale.price = price  
    sale.transactionHash = transactionHash
    sale.timestamp = timestamp
    sale.searchCategory = nft.category
    sale.searchContractAddress = nft.contractAddress
    sale.searchTokenId = nft.tokenId
    sale.save()    

    let buyerAccount = createOrLoadAccount(buyer)
    buyerAccount.purchases = buyerAccount.purchases.plus(BigInt.fromI32(1))
    buyerAccount.spent = buyerAccount.spent.plus(price)
    buyerAccount.save()

    let sellerAccount = createOrLoadAccount(seller)
    sellerAccount.sales = sellerAccount.sales.plus(BigInt.fromI32(1))
    sellerAccount.earned = sellerAccount.earned.plus(price)
    sellerAccount.save()

    nft.soldAt = timestamp
    nft.sales =  nft.sales.plus(BigInt.fromI32(1))
    nft.volume = nft.volume.plus(price)
    nft.updatedAt = timestamp
    nft.save()

    let analyticsDayData = updateAnalyticsDayData(sale, feesCollectorCut)
    analyticsDayData.save()
}

export function updateAnalyticsDayData(sales: Sale, feesCollectorCut: BigInt): AnalyticsDayData {
    let analyticsDayData = getOrCreateAnalyticsDayData(sales.timestamp)
    analyticsDayData.sales = analyticsDayData.sales.plus(BigInt.fromI32(1))
    analyticsDayData.volume = analyticsDayData.volume.plus(sales.price)
    analyticsDayData.daoEarning = analyticsDayData.daoEarning.plus(feesCollectorCut.times(sales.price).div(ONE_MILLION))

    return analyticsDayData as AnalyticsDayData
}

export function getOrCreateAnalyticsDayData(blockTimestamp: BigInt): AnalyticsDayData {
    let timestamp = blockTimestamp.toI32()
    let dayID = timestamp / 86400
    let dayStartTimestamp = dayID * 86400
    let analyticsDayData = AnalyticsDayData.load(dayID.toString())
    if (analyticsDayData == null) {
        analyticsDayData = new AnalyticsDayData(dayID.toString())
        analyticsDayData.date = BigInt.fromI32(dayStartTimestamp)
        analyticsDayData.sales = BigInt.fromI32(0)
        analyticsDayData.volume = BigInt.fromI32(0)
        analyticsDayData.creatorsEarning = BigInt.fromI32(0)
        analyticsDayData.daoEarning = BigInt.fromI32(0)
    }
    return analyticsDayData as AnalyticsDayData
}