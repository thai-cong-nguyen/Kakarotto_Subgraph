import { ItemCreated, MetadataUpdate, KakarottoItem as KakarottoItemABI, Transfer } from "../../generated/KakarottoItem/KakarottoItem"
import { Item, ItemAttribute, NFT } from "../../generated/schema"
import { getCategories } from "../modules/category"
import { buildItemFromNFT, getItemId } from "../modules/item"
import { createItemAttribute } from "../modules/itemAttribute"
import { getNFTId } from "../modules/nft"
import * as rarities from "../modules/nft/rarity"
import * as attributes from "../modules/attribute/attribute"
import { ERC721 } from "../../generated/templates"
import { buildCount } from "../modules/count"
import { BigInt, Bytes, log } from "@graphprotocol/graph-ts"

export function handleItemCreated(event: ItemCreated): void {
    let count = buildCount()
    if (count.itemStarted == BigInt.fromI32(0)) {
        ERC721.create(event.address)
        count.itemStarted = BigInt.fromI32(1)
        count.save()
    }
    log.info("Item Created: {}", [event.params.tokenId.toString()])
    const category = getCategories(event.address)
    const nftId = getNFTId(category, event.address, event.params.tokenId)
    let nft = NFT.load(nftId)
    if (!nft) {
        log.warning("NFT not found: {}", [nftId])
        nft = new NFT(nftId)
        nft.tokenId = event.params.tokenId
        nft.contractAddress = changetype<Bytes>(event.address)
        nft.category = category
        nft.owner = changetype<Bytes>(event.address).toHexString()
        nft.creator = changetype<Bytes>(event.address)
        nft.amount = BigInt.fromI32(1)
        nft.createdAt = event.block.timestamp
        nft.transferredAt = event.block.timestamp
        nft.soldAt = null
        nft.updatedAt = event.block.timestamp
        // analytics
        nft.sales = BigInt.fromI32(0)
        nft.volume = BigInt.fromI32(0)
        nft.save()
    }

    let item = buildItemFromNFT(nft)
    if (item == null) {
        log.warning("Item not found: {}", [nftId])
        return
    }

    // Item info
    const itemInfo = KakarottoItemABI.bind(event.address).getItemInformation(event.params.tokenId)
    // Rarity
    switch (itemInfo.rarity.toI32()) {
        case rarities.RarityEnum.BRONZE:
            nft.rarity = rarities.BRONZE
            break
        case rarities.RarityEnum.SILVER:
            nft.rarity = rarities.SILVER
            break
        case rarities.RarityEnum.GOLD:
            nft.rarity = rarities.GOLD
            break
        case rarities.RarityEnum.PLATINUM:
            nft.rarity = rarities.PLATINUM
            break
        case rarities.RarityEnum.DIAMOND:
            nft.rarity = rarities.DIAMOND
            break
        default:
            nft.rarity = rarities.BRONZE
            break
    }
    
    // Attributes
    let attributesArray: Array<ItemAttribute> = []
    for (let i = 0; i < itemInfo.attributes.length; i++) {
        const attribute = itemInfo.attributes[i]
        const attributeName = attribute.attribute == attributes.AttributeEnum.POWER ? attributes.POWER : attribute.attribute == attributes.AttributeEnum.DEFEND ? attributes.DEFEND : attribute.attribute == attributes.AttributeEnum.AGILITY ? attributes.AGILITY : attribute.attribute == attributes.AttributeEnum.INTELLIGENCE ? attributes.INTELLIGENCE : attributes.LUCK
        attributesArray.push(createItemAttribute(event, attributeName, attribute.value, attribute.isIncrease, attribute.isPercentage))
    }

    // update NFT
    nft.searchItemAttribute = attributesArray.map<string>((attr) => attr.id)
    nft.save()
    item.save()
}