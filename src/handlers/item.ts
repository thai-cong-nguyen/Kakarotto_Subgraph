import { ItemCreated, MetadataUpdate, KakarottoItem as KakarottoItemABI } from "../../generated/KakarottoItem/KakarottoItem"
import { Item, ItemAttribute, NFT } from "../../generated/schema"
import { getCategories } from "../modules/category"
import { getItemId } from "../modules/item"
import { createItemAttribute } from "../modules/itemAttribute"
import { getNFTId } from "../modules/nft"
import * as rarities from "../modules/nft/rarity"
import * as attributes from "../modules/attribute/attribute"

export function handleItemCreated(event: ItemCreated): void {
    const itemId = getItemId(event.address, event.params.tokenId)
    let item = Item.load(itemId)
    if (!item) {
        return
    }
    const category = getCategories(event.address.toHexString())
    const nftId = getNFTId(category, event.address, event.params.tokenId)
    let nft = NFT.load(nftId)
    if (!nft) {
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
}