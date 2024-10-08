import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts";
import { KakarottoCharacterCreated } from "../../../generated/KakarottoCharacter/KakarottoCharacter";
import { Character, CharacterAttribute } from "../../../generated/schema";

export function getCharacterAttributeId(contractAddress: Address, tokenId: BigInt, attributeName: string): string {
    return (changetype<Bytes>(contractAddress)).toHexString() + "-" + tokenId.toString() + "-" + attributeName
}

export function createCharacterAttribute(event: KakarottoCharacterCreated, attributeName: string, value: BigInt, character: Character): CharacterAttribute {
    let attributeId = getCharacterAttributeId(event.address, event.params.tokenId, attributeName)
    let attribute = new CharacterAttribute(attributeId)
    attribute.attribute = attributeName
    attribute.value = value
    attribute.character = character.id
    attribute.save()
    
    return attribute
}