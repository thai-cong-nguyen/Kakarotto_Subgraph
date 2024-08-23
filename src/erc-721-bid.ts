import {
  BidAccepted as BidAcceptedEvent,
  BidCancelled as BidCancelledEvent,
  BidCreated as BidCreatedEvent,
  ChangedFeePercentage as ChangedFeePercentageEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Paused as PausedEvent,
  Unpaused as UnpausedEvent
} from "../generated/ERC721Bid/ERC721Bid"
import {
  BidAccepted,
  BidCancelled,
  BidCreated,
  ChangedFeePercentage,
  OwnershipTransferred,
  Paused,
  Unpaused
} from "../generated/schema"

export function handleBidAccepted(event: BidAcceptedEvent): void {
  let entity = new BidAccepted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._id = event.params._id
  entity._tokenAddress = event.params._tokenAddress
  entity._tokenId = event.params._tokenId
  entity._bidder = event.params._bidder
  entity._seller = event.params._seller
  entity._price = event.params._price
  entity._fee = event.params._fee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBidCancelled(event: BidCancelledEvent): void {
  let entity = new BidCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._id = event.params._id
  entity._tokenAddress = event.params._tokenAddress
  entity._tokenId = event.params._tokenId
  entity._bidder = event.params._bidder

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBidCreated(event: BidCreatedEvent): void {
  let entity = new BidCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._id = event.params._id
  entity._tokenAddress = event.params._tokenAddress
  entity._tokenId = event.params._tokenId
  entity._bidder = event.params._bidder
  entity._price = event.params._price
  entity._expiresAt = event.params._expiresAt

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleChangedFeePercentage(
  event: ChangedFeePercentageEvent
): void {
  let entity = new ChangedFeePercentage(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._feePercentage = event.params._feePercentage

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
