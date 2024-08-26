import {
    OrderCancelled as OrderCancelledEvent,
    OrderCreated as OrderCreatedEvent,
    OrderSuccessful as OrderSuccessfulEvent,
    KakarottoMarketplace as KakarottoMarketplaceABI
  } from "../../generated/KakarottoMarketplace/KakarottoMarketplace"
  import {
    NFT,
    Order
  } from "../../generated/schema"
import { getCategories } from "../modules/category"
import { getNFTId, updateNFTOrderProperties } from "../modules/nft"
import * as categories from "../modules/category/categories"
import * as statuses from "../modules/order/status"
import { ORDER_SALE_TYPE, trackSale } from "../modules/analytics"
import { BigInt, Bytes } from "@graphprotocol/graph-ts"


export function handleOrderCreated(event: OrderCreatedEvent): void {
  const category = getCategories(event.params.nftAddress)
  const nftId = getNFTId(category, event.params.nftAddress, event.params.assetId)

  let nft = NFT.load(nftId)
  if (nft != null) {
    const orderId = event.params.id.toHexString()

    let order = new Order(orderId)
    order.marketplaceAddress = changetype<Bytes>(event.address)
    order.category = category
    order.nft = nftId
    order.nftAddress = changetype<Bytes>(event.params.nftAddress)
    order.tokenId = event.params.assetId
    order.amount = BigInt.fromI32(1)
    order.transactionHash = event.transaction.hash
    order.owner = changetype<Bytes>(event.params.seller)
    order.price = event.params.priceInWei
    order.status = statuses.OPEN
    order.blockNumber = event.block.number
    order.expiresAt = event.params.expiresAt
    order.createdAt = event.block.timestamp
    order.updatedAt = event.block.timestamp
  }
}

export function handleOrderSuccessful(event: OrderSuccessfulEvent): void {
  const category = getCategories(event.params.nftAddress) 
  const nftId = getNFTId(
    category,
    event.params.nftAddress,
    event.params.assetId
  )
  const orderId = event.params.id.toHexString()
  
  let order = Order.load(orderId)
  if (order == null) {
    return
  }

  order.category = category
  order.status = statuses.SOLD
  order.buyer = changetype<Bytes>(event.params.buyer)
  order.price = event.params.totalPrice
  order.blockNumber = event.block.number
  order.updatedAt = event.block.timestamp
  order.save()

  let nft = NFT.load(nftId)
  if (nft == null) {
    return
  }

  nft.owner = (changetype<Bytes>(event.params.buyer)).toHexString()
  nft.updatedAt = event.block.timestamp
  nft = updateNFTOrderProperties(nft, order)
  nft.save()

  const marketplaceContract = KakarottoMarketplaceABI.bind(event.address)
  const feePercentage = marketplaceContract.try_feePercentage()

  // analytics
  trackSale(ORDER_SALE_TYPE, event.params.buyer, event.params.seller, nft.id, order.price, feePercentage.reverted ? BigInt.fromI32(0) : feePercentage.value, event.block.timestamp, event.transaction.hash)
}

export function handleOrderCancelled(event: OrderCancelledEvent): void {
  const category = getCategories(event.params.nftAddress)
  const nftId = getNFTId(
    category,
    event.params.nftAddress,
    event.params.assetId
  )
  const orderId = event.params.id.toHex()

  let nft = NFT.load(nftId)
  let order = Order.load(orderId)

  if (nft != null && order != null) {
    order.category = category
    order.status = statuses.CANCELLED
    order.blockNumber = event.block.number
    order.updatedAt = event.block.timestamp
    order.save()

    nft.updatedAt = event.block.timestamp
    nft = updateNFTOrderProperties(nft, order)
    nft.save()
  }
}