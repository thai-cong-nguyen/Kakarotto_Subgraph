import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import { KakarottoItem as KakarottoItemABI } from "../../../generated/KakarottoItem/KakarottoItem"
import * as rarities from '../nft/rarity'
import { Item, NFT } from "../../../generated/schema"

export function getItemRarity(
    contractAddress: Address,
    tokenId: BigInt
): string {
    let contract = KakarottoItemABI.bind(contractAddress)
    let infoCallResult = contract.getItemInformation(tokenId)

    switch (infoCallResult.rarity.toI32()) {
        case rarities.RarityEnum.BRONZE: 
            return rarities.BRONZE
        case rarities.RarityEnum.SILVER:
            return rarities.SILVER
        case rarities.RarityEnum.GOLD:
            return rarities.GOLD
        case rarities.RarityEnum.PLATINUM:
            return rarities.PLATINUM
        case rarities.RarityEnum.DIAMOND:
            return rarities.DIAMOND
    }

    log.warning('Can not find rarity', [tokenId.toString(), (changetype<Bytes>(contractAddress)).toHexString()])
    return ""
}

export function getItemId(contractAddress: Address, tokenId: BigInt): string{
    let itemId = contractAddress.toHexString() + '-' + tokenId.toString()
    return itemId
}

export function buildItemFromNFT(nft: NFT): Item {
    let item = new Item(nft.id)

    // Item
    // nothing
    return item
}