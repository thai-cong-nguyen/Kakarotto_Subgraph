import {
  ChangeFeeCollector as ChangeFeeCollectorEvent,
  ChangeFeePercentage as ChangeFeePercentageEvent,
  ChangePublicationFee as ChangePublicationFeeEvent,
  OrderCancelled as OrderCancelledEvent,
  OrderCreated as OrderCreatedEvent,
  OrderSuccessful as OrderSuccessfulEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Paused as PausedEvent,
  Unpaused as UnpausedEvent
} from "../generated/KakarottoMarketplace/KakarottoMarketplace"
import {
  ChangeFeeCollector,
  ChangeFeePercentage,
  ChangePublicationFee,
  OrderCancelled,
  OrderCreated,
  OrderSuccessful,
  OwnershipTransferred,
  Paused,
  Unpaused
} from "../generated/schema"

export function handleChangeFeeCollector(event: ChangeFeeCollectorEvent): void {
  let entity = new ChangeFeeCollector(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.feeCollector = event.params.feeCollector

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleChangeFeePercentage(
  event: ChangeFeePercentageEvent
): void {
  let entity = new ChangeFeePercentage(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.feePercentage = event.params.feePercentage

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleChangePublicationFee(
  event: ChangePublicationFeeEvent
): void {
  let entity = new ChangePublicationFee(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.publicationFeeInWei = event.params.publicationFeeInWei

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderCancelled(event: OrderCancelledEvent): void {
  let entity = new OrderCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.KakarottoMarketplace_id = event.params.id
  entity.assetId = event.params.assetId
  entity.seller = event.params.seller
  entity.nftAddress = event.params.nftAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderCreated(event: OrderCreatedEvent): void {
  let entity = new OrderCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.KakarottoMarketplace_id = event.params.id
  entity.assetId = event.params.assetId
  entity.seller = event.params.seller
  entity.nftAddress = event.params.nftAddress
  entity.priceInWei = event.params.priceInWei
  entity.expiresAt = event.params.expiresAt

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderSuccessful(event: OrderSuccessfulEvent): void {
  let entity = new OrderSuccessful(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.KakarottoMarketplace_id = event.params.id
  entity.assetId = event.params.assetId
  entity.seller = event.params.seller
  entity.buyer = event.params.buyer
  entity.nftAddress = event.params.nftAddress
  entity.totalPrice = event.params.totalPrice

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new Unpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
