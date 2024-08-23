import { Address, BigInt } from "@graphprotocol/graph-ts"
import { ItemCreated } from "../../../generated/KakarottoItem/KakarottoItem"
import { ItemAttribute } from "../../../generated/schema"
import * as attributes from "../../modules/attribute/attribute"

export function getItemAttributeId(contractAddress: Address, tokenId: BigInt, attributeName: string): string {
    return contractAddress.toHexString() + "-" + tokenId.toString() + "-" + attributeName
}

export function createItemAttribute(event: ItemCreated, attributeName: string, value: BigInt, isIncrease: boolean, isPercentage: boolean): ItemAttribute {
    const attributeId = getItemAttributeId(event.address, event.params.tokenId, attributeName)
    let attribute = new ItemAttribute(attributeId)
    attribute.attribute = attributeName
    attribute.value = value
    attribute.isIncrease = isIncrease
    attribute.isPercentage = isPercentage
    
    return attribute
}