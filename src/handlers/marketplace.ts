import {
    OrderCancelled as OrderCancelledEvent,
    OrderCreated as OrderCreatedEvent,
    OrderSuccessful as OrderSuccessfulEvent,
    KakarottoMarketplace
  } from "../../generated/KakarottoMarketplace/KakarottoMarketplace"
  import {
    NFT,
    Order
  } from "../../generated/schema"
import { getCategories } from "../modules/category"
import { getNFTId } from "../modules/nft"
import * as categories from "../modules/category/categories"
import * as statuses from "../modules/order/status"


export function handleOrderCreated(event: OrderCreatedEvent): void {
  const category = getCategories(event.params.nftAddress.toHexString())
  const nftId = getNFTId(category, event.params.nftAddress, event.params.assetId)

  let nft = NFT.load(nftId)
  if (nft != null) {
    const orderId = event.params.id.toHex()

    let order = new Order(orderId)
    order.marketplaceAddress = event.address
    order.category = category
    order.nft = nftId
    order.nftAddress = event.params.nftAddress
    order.tokenId = event.params.assetId
    order.amount = 1
    order.transactionHash = event.transaction.hash
    order.owner = event.params.seller
    order.price = event.params.priceInWei
    order.status = statuses.OPEN
    order.blockNumber = event.block.number
    order.expiresAt = event.params.expiresAt
    order.createdAt = event.block.timestamp
    order.updatedAt = event.block.timestamp
  }
}

export function handleOrderSuccessful(event: OrderSuccessfulEvent): void {
}

export function handleOrderCancelled(event: OrderCancelledEvent): void {
}