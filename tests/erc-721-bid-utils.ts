import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  BidAccepted,
  BidCancelled,
  BidCreated,
  ChangedFeePercentage,
  OwnershipTransferred,
  Paused,
  Unpaused
} from "../generated/ERC721Bid/ERC721Bid"

export function createBidAcceptedEvent(
  _id: Bytes,
  _tokenAddress: Address,
  _tokenId: BigInt,
  _bidder: Address,
  _seller: Address,
  _price: BigInt,
  _fee: BigInt
): BidAccepted {
  let bidAcceptedEvent = changetype<BidAccepted>(newMockEvent())

  bidAcceptedEvent.parameters = new Array()

  bidAcceptedEvent.parameters.push(
    new ethereum.EventParam("_id", ethereum.Value.fromFixedBytes(_id))
  )
  bidAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      "_tokenAddress",
      ethereum.Value.fromAddress(_tokenAddress)
    )
  )
  bidAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      "_tokenId",
      ethereum.Value.fromUnsignedBigInt(_tokenId)
    )
  )
  bidAcceptedEvent.parameters.push(
    new ethereum.EventParam("_bidder", ethereum.Value.fromAddress(_bidder))
  )
  bidAcceptedEvent.parameters.push(
    new ethereum.EventParam("_seller", ethereum.Value.fromAddress(_seller))
  )
  bidAcceptedEvent.parameters.push(
    new ethereum.EventParam("_price", ethereum.Value.fromUnsignedBigInt(_price))
  )
  bidAcceptedEvent.parameters.push(
    new ethereum.EventParam("_fee", ethereum.Value.fromUnsignedBigInt(_fee))
  )

  return bidAcceptedEvent
}

export function createBidCancelledEvent(
  _id: Bytes,
  _tokenAddress: Address,
  _tokenId: BigInt,
  _bidder: Address
): BidCancelled {
  let bidCancelledEvent = changetype<BidCancelled>(newMockEvent())

  bidCancelledEvent.parameters = new Array()

  bidCancelledEvent.parameters.push(
    new ethereum.EventParam("_id", ethereum.Value.fromFixedBytes(_id))
  )
  bidCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "_tokenAddress",
      ethereum.Value.fromAddress(_tokenAddress)
    )
  )
  bidCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "_tokenId",
      ethereum.Value.fromUnsignedBigInt(_tokenId)
    )
  )
  bidCancelledEvent.parameters.push(
    new ethereum.EventParam("_bidder", ethereum.Value.fromAddress(_bidder))
  )

  return bidCancelledEvent
}

export function createBidCreatedEvent(
  _id: Bytes,
  _tokenAddress: Address,
  _tokenId: BigInt,
  _bidder: Address,
  _price: BigInt,
  _expiresAt: BigInt
): BidCreated {
  let bidCreatedEvent = changetype<BidCreated>(newMockEvent())

  bidCreatedEvent.parameters = new Array()

  bidCreatedEvent.parameters.push(
    new ethereum.EventParam("_id", ethereum.Value.fromFixedBytes(_id))
  )
  bidCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "_tokenAddress",
      ethereum.Value.fromAddress(_tokenAddress)
    )
  )
  bidCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "_tokenId",
      ethereum.Value.fromUnsignedBigInt(_tokenId)
    )
  )
  bidCreatedEvent.parameters.push(
    new ethereum.EventParam("_bidder", ethereum.Value.fromAddress(_bidder))
  )
  bidCreatedEvent.parameters.push(
    new ethereum.EventParam("_price", ethereum.Value.fromUnsignedBigInt(_price))
  )
  bidCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "_expiresAt",
      ethereum.Value.fromUnsignedBigInt(_expiresAt)
    )
  )

  return bidCreatedEvent
}

export function createChangedFeePercentageEvent(
  _feePercentage: BigInt
): ChangedFeePercentage {
  let changedFeePercentageEvent = changetype<ChangedFeePercentage>(
    newMockEvent()
  )

  changedFeePercentageEvent.parameters = new Array()

  changedFeePercentageEvent.parameters.push(
    new ethereum.EventParam(
      "_feePercentage",
      ethereum.Value.fromUnsignedBigInt(_feePercentage)
    )
  )

  return changedFeePercentageEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}
