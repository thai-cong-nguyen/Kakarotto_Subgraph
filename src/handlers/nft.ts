import { BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import { Character, Item, NFT } from "../../generated/schema"
import { Transfer } from "../../generated/templates/ERC721/ERC721"
import { getCategories } from "../modules/category"
import { cancelActiveOrder, clearNFTOrderProperties, getNFTId, getTokenURI, isMint, isTransferERC6551Account } from "../modules/nft"
import * as addresses from "../data/addresses"
import * as categories from "../modules/category/categories"
import { buildCountFromNFT } from "../modules/count"
import { buildCharacterFromNFT } from "../modules/character"
import { buildItemFromNFT } from "../modules/item"
import { createOrLoadAccount } from "../modules/account"

export function handleTransfer(event: Transfer): void {
    if (event.params.tokenId.toString() == "") {
        return 
    }

    let category = getCategories(event.address)
    let id = getNFTId(category, event.address, event.params.tokenId)
    let toAddress = (changetype<Bytes>(event.params.to)).toHexString()

    // let nft = NFT.load(id)
    // if (nft == null) {
    //     log.warning("NFT not found: {}", [id])
    //     nft = new NFT(id)
    //     // Normal Transfer
    //     nft.tokenId = event.params.tokenId
    //     nft.contractAddress = changetype<Bytes>(event.address)
    //     nft.category = category
    //     nft.owner = toAddress
    //     nft.amount = BigInt.fromI32(1)
    //     // Timestamps
    //     nft.updatedAt = event.block.timestamp
    //     nft.soldAt = null
    //     nft.transferredAt = event.block.timestamp
    //     // analytics
    //     nft.sales = BigInt.fromI32(0)
    //     nft.volume = BigInt.fromI32(0)

    //     nft.tokenURI = getTokenURI(event)
    //     nft.save()
    // }

    let nft = new NFT(id)
    // Normal Transfer
    nft.tokenId = event.params.tokenId
    nft.contractAddress = changetype<Bytes>(event.address)
    nft.category = category
    nft.owner = toAddress
    nft.searchOwner = toAddress
    nft.amount = BigInt.fromI32(1)
    // Timestamps
    nft.updatedAt = event.block.timestamp
    nft.soldAt = null
    nft.transferredAt = event.block.timestamp
    // analytics
    nft.sales = BigInt.fromI32(0)
    nft.volume = BigInt.fromI32(0)

    nft.tokenURI = getTokenURI(event)

    if (isMint(event)) {
        log.info("Minting NFT: {}", [id])
        nft.createdAt = event.block.timestamp
        nft.creator = changetype<Bytes>(event.params.to)
        let metric = buildCountFromNFT(nft)
        metric.save()
    }
    else {
        let oldNFT = NFT.load(id)
        if (cancelActiveOrder(oldNFT!, event.block.timestamp)) {
            nft = clearNFTOrderProperties(nft)
        }
    }

    if (category == categories.CHARACTER) {
        let character: Character = buildCharacterFromNFT(nft)
        if (isMint(event)) {
            nft.character = character.id
            // search indexes
            nft.searchIsCharacter = true
            nft.searchCharacterLevel = character.level
            nft.searchCharacterExp = character.exp
        }
        character.save()
        log.info("Transferring Character: {}", [character.id])
    }
    else if (category == categories.ITEM) {
        let item: Item = buildItemFromNFT(nft)
        if (isMint(event)) {
            nft.item = item.id
            // search indexes
            nft.searchIsItem = true
        }
        item.save()
        log.info("Transferring Item: {}", [item.id])
    }
    createOrLoadAccount(event.params.to)
    nft.save()
    log.info("Transferring NFT: {}", [nft.id, nft.owner, nft.amount.toString(), nft.category, nft.tokenId.toString(), nft.tokenURI ? changetype<string>(nft.tokenURI) : ""])
}