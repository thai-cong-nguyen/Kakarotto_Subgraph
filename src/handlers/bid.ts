import { Address } from "@graphprotocol/graph-ts"
import { BidAccepted as BidAcceptedEvent, BidCancelled as BidCancelledEvent, BidCreated as BidCreatedEvent, ERC721Bid as ERC721BidABI } from "../../generated/ERC721Bid/ERC721Bid"
import { Bid, NFT } from "../../generated/schema"
import { getBidId } from "../modules/bid"
import { getCategories } from "../modules/category"
import { getNFTId } from "../modules/nft"
import * as status from "../modules/order/status"
import { BID_SALE_TYPE, trackSale } from "../modules/analytics"

export function handleBidCreated(event: BidCreatedEvent): void {
    const category = getCategories(event.params._tokenAddress.toHexString())
    const nftId = getNFTId(
        category, 
        event.params._tokenAddress,
        event.params._tokenId,
    )
    const bidId = getBidId(
        event.params._tokenAddress,
        event.params._tokenId,
        event.params._bidder
    )
    let nft = NFT.load(nftId)
    let bid = new Bid(bidId)

    if (nft != null) {
        bid.bidAddress = event.address
        bid.category = category
        bid.nft = nftId
        bid.nftAddress = event.params._tokenAddress
        bid.tokenId = event.params._tokenId
        bid.bidder = event.params._bidder
        // Assumption: The owner of the NFT is the seller when the bid is created
        bid.seller = Address.fromString(nft.owner)
        bid.price = event.params._price
        bid.status = status.OPEN
        bid.blockchainId = event.params._id.toHexString()
        bid.blockNumber = event.block.number
        bid.expiresAt = event.params._expiresAt
        bid.createdAt = event.block.timestamp
        bid.updatedAt = event.block.timestamp
        bid.save()

        nft.updatedAt = event.block.timestamp
        nft.save()
    }
}

export function handleBidAccepted(event: BidAcceptedEvent): void {
    const bidId = getBidId(
        event.params._tokenAddress,
        event.params._tokenId,
        event.params._bidder
    )

    let bid = Bid.load(bidId)
    if (bid == null || bid.nft == null) {
        return
    }
    if (bid.nft == null || bid.nft == "") {
        return
    }
    let nft = NFT.load(bid.nft as string)
    if (nft == null) {
        return
    }

    bid.status = status.SOLD
    bid.seller = event.params._seller
    bid.blockNumber = event.block.number
    bid.updatedAt = event.block.timestamp
    bid.save()

    nft.updatedAt = event.block.timestamp
    nft.save()

    const bidContract = ERC721BidABI.bind(event.address)

    trackSale(
        BID_SALE_TYPE,
        event.params._bidder,
        event.params._seller,
        nft.id,
        bid.price,
        bidContract.feePercentage(),
        event.block.timestamp,
        event.transaction.hash
    )
}

export function handleBidCancelled(event: BidCancelledEvent): void {
    const bidId = getBidId(
        event.params._tokenAddress,
        event.params._tokenId,
        event.params._bidder
    )

    let bid = Bid.load(bidId)
    if (bid == null || bid.nft == null) {
        return
    }
    if (bid.nft == null || bid.nft == "") {
        return
    }
    let nft = NFT.load(bid.nft as string)
    if (nft == null) {
        return
    }

    bid.status = status.CANCELLED
    bid.blockNumber = event.block.number
    bid.updatedAt = event.block.timestamp
    bid.save()

    nft.updatedAt = event.block.timestamp
    nft.save()
}