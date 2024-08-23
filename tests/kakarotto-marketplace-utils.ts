import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
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
} from "../generated/KakarottoMarketplace/KakarottoMarketplace"

export function createChangeFeeCollectorEvent(
  feeCollector: Address
): ChangeFeeCollector {
  let changeFeeCollectorEvent = changetype<ChangeFeeCollector>(newMockEvent())

  changeFeeCollectorEvent.parameters = new Array()

  changeFeeCollectorEvent.parameters.push(
    new ethereum.EventParam(
      "feeCollector",
      ethereum.Value.fromAddress(feeCollector)
    )
  )

  return changeFeeCollectorEvent
}

export function createChangeFeePercentageEvent(
  feePercentage: BigInt
): ChangeFeePercentage {
  let changeFeePercentageEvent = changetype<ChangeFeePercentage>(newMockEvent())

  changeFeePercentageEvent.parameters = new Array()

  changeFeePercentageEvent.parameters.push(
    new ethereum.EventParam(
      "feePercentage",
      ethereum.Value.fromUnsignedBigInt(feePercentage)
    )
  )

  return changeFeePercentageEvent
}

export function createChangePublicationFeeEvent(
  publicationFeeInWei: BigInt
): ChangePublicationFee {
  let changePublicationFeeEvent = changetype<ChangePublicationFee>(
    newMockEvent()
  )

  changePublicationFeeEvent.parameters = new Array()

  changePublicationFeeEvent.parameters.push(
    new ethereum.EventParam(
      "publicationFeeInWei",
      ethereum.Value.fromUnsignedBigInt(publicationFeeInWei)
    )
  )

  return changePublicationFeeEvent
}

export function createOrderCancelledEvent(
  id: Bytes,
  assetId: BigInt,
  seller: Address,
  nftAddress: Address
): OrderCancelled {
  let orderCancelledEvent = changetype<OrderCancelled>(newMockEvent())

  orderCancelledEvent.parameters = new Array()

  orderCancelledEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  orderCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "assetId",
      ethereum.Value.fromUnsignedBigInt(assetId)
    )
  )
  orderCancelledEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  orderCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )

  return orderCancelledEvent
}

export function createOrderCreatedEvent(
  id: Bytes,
  assetId: BigInt,
  seller: Address,
  nftAddress: Address,
  priceInWei: BigInt,
  expiresAt: BigInt
): OrderCreated {
  let orderCreatedEvent = changetype<OrderCreated>(newMockEvent())

  orderCreatedEvent.parameters = new Array()

  orderCreatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "assetId",
      ethereum.Value.fromUnsignedBigInt(assetId)
    )
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "priceInWei",
      ethereum.Value.fromUnsignedBigInt(priceInWei)
    )
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "expiresAt",
      ethereum.Value.fromUnsignedBigInt(expiresAt)
    )
  )

  return orderCreatedEvent
}

export function createOrderSuccessfulEvent(
  id: Bytes,
  assetId: BigInt,
  seller: Address,
  buyer: Address,
  nftAddress: Address,
  totalPrice: BigInt
): OrderSuccessful {
  let orderSuccessfulEvent = changetype<OrderSuccessful>(newMockEvent())

  orderSuccessfulEvent.parameters = new Array()

  orderSuccessfulEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  orderSuccessfulEvent.parameters.push(
    new ethereum.EventParam(
      "assetId",
      ethereum.Value.fromUnsignedBigInt(assetId)
    )
  )
  orderSuccessfulEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  orderSuccessfulEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  orderSuccessfulEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  orderSuccessfulEvent.parameters.push(
    new ethereum.EventParam(
      "totalPrice",
      ethereum.Value.fromUnsignedBigInt(totalPrice)
    )
  )

  return orderSuccessfulEvent
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
