import { log, BigInt, Address } from '@graphprotocol/graph-ts'
import { NFT, Order, Bid } from '../../../generated/schema'
import { Transfer as TransferEvent, ERC721 } from '../../../generated/templates/ERC721/ERC721'
import * as status from '../order/status'
import * as addresses from '../../data/addresses'

export function isMint(event: TransferEvent): boolean {
  return event.params.from.toHexString() == addresses.ZERO_ADDRESS
}

export function getNFTId(
  category: string,
  contractAddress: Address,
  tokenId: BigInt
): string {
  return category + '-' + contractAddress.toHexString() + '-' + tokenId.toString()
}

export function getTokenURI(event: TransferEvent): string {
  let contract = ERC721.bind(event.address)
  let tokenURICallResult = contract.try_tokenURI(event.params.tokenId)
  let tokenURI = ''
  if (tokenURICallResult.reverted) {
    log.warning('tokenURI call reverted for token {}', [event.params.tokenId.toString(), event.address.toString()])
  }
  else {
    tokenURI = tokenURICallResult.value
  }
  return tokenURI
}

export function updateNFTOrderProperties(nft: NFT, order: Order): NFT {
    if (order.status == status.OPEN)  {
        return addNFTOrderProperties(nft, order)
    }
    else if (order.status == status.SOLD || order.status == status.CANCELLED) {
        return clearNFTOrderProperties(nft)
    }
    return nft
}

export function addNFTOrderProperties(nft: NFT, order: Order): NFT {
    nft.activeOrder = order.id
    nft.searchOrderStatus = order.status
    nft.searchOrderPrice = order.price
    nft.searchOrderCreatedAt = order.createdAt
    nft.searchOrderExpiresAt = order.expiresAt
    return nft
}

export function clearNFTOrderProperties(nft: NFT): NFT {
    nft.activeOrder = null
    nft.searchOrderStatus = null
    nft.searchOrderPrice = null
    nft.searchOrderCreatedAt = null
    nft.searchOrderExpiresAt = null
    return nft
}

export function cancelActiveOrder(nft: NFT, now: BigInt): boolean {
    if (nft.activeOrder == null) {
        return false
    }
    let previousOrder = Order.load(nft.activeOrder)
    if (previousOrder != null && previousOrder.status == status.OPEN) {
      previousOrder.status = status.CANCELLED
      previousOrder.updatedAt = now
      previousOrder.save()
      return true
    }
    return false
}