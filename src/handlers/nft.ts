import { BigInt } from "@graphprotocol/graph-ts"
import { Character, Item, NFT } from "../../generated/schema"
import { Transfer } from "../../generated/templates/ERC721/ERC721"
import { getCategories } from "../modules/category"
import { cancelActiveOrder, clearNFTOrderProperties, getNFTId, getTokenURI, isMint } from "../modules/nft"
import * as addresses from "../data/addresses"
import * as categories from "../modules/category/categories"
import { buildCountFromNFT } from "../modules/count"
import { buildCharacterFromNFT } from "../modules/character"
import { buildItemFromNFT } from "../modules/item"

export function handleTransfer(event: Transfer): void {
    if (event.params.tokenId.toString() == "") {
        return 
    }

    let contractAddress = event.address.toHexString()
    let category = getCategories(contractAddress)
    let id = getNFTId(category, event.address, event.params.tokenId)
    let toAddress = event.params.to.toHex()

    let nft = new NFT(id)
    
    // Normal Transfer
    nft.tokenId = event.params.tokenId
    nft.contractAddress = event.address
    nft.category = category
    nft.owner = event.params.to.toHex()
    // Timestamps
    nft.updatedAt = event.block.timestamp
    nft.soldAt = null
    nft.transferredAt = event.block.timestamp
    // analytics
    nft.sales = 0
    nft.volume = BigInt.fromI32(0)

    nft.tokenURI = getTokenURI(event)

    if (isMint(event)) {
        nft.createdAt = event.block.timestamp
        nft.owner = toAddress
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
        let character: Character
        if (isMint(event)) {
            character = buildCharacterFromNFT(nft)
            nft.character = character.id

            // search indexes
            nft.searchIsCharacter = true
            nft.searchCharacterLevel = character.level
            nft.searchCharacterExp = character.exp
            character.save()
        }
    }
    else if (category == categories.ITEM) {
        let item: Item
        if (isMint(event)) {
            item = buildItemFromNFT(nft)
            nft.item = item.id

            // search indexes
            nft.searchIsItem = true
        }
    }
    else if (category == categories.TREASURE) {

    }
}