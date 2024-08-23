
import { KakarottoCharacterCreated, KakarottoCharacterLevelUp, KakarottoCharacter as KakarottoCharacterABI, KakarottoCharacterIncreasedExp } from "../../generated/KakarottoCharacter/KakarottoCharacter"
import { Account, Character, CharacterAccount, CharacterAttribute, NFT } from '../../generated/schema';
import { Address, BigInt, log } from "@graphprotocol/graph-ts"
import { getNFTId } from "../modules/nft";
import { getCategories } from "../modules/category";
import { getCharacterId } from "../modules/character";
import * as rarities from "../modules/nft/rarity";
import { createCharacterAttribute, getCharacterAttributeId } from "../modules/characterAttribute";
import * as attributes from "../modules/attribute/attribute";

export function handleCharacterCreated(event: KakarottoCharacterCreated): void {
    let characterAccount = CharacterAccount.load(event.params.account.toHexString())
    if (characterAccount) {
        log.error("Character already exists: {}", [event.params.account.toHexString()])
        return 
    }
    let character = Character.load(getCharacterId(event.address, event.params.tokenId))
    if (!character) {
        return
    }
    const category = getCategories(event.address.toHexString())
    let nft = NFT.load(getNFTId(category, event.address, event.params.tokenId))
    if (!nft) {
        return
    }

    // ERC-6551 Account
    characterAccount = new CharacterAccount(event.params.account.toHexString())
    characterAccount.contractAddress = event.address
    characterAccount.save()

    const characterInfo = KakarottoCharacterABI.bind(event.address).getCharacterInfo(event.params.tokenId)
    // Rarity
    switch (characterInfo.rarity.toI32()) {
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
    let attributesArray: Array<CharacterAttribute> = [
    // POWER
    createCharacterAttribute(event, attributes.POWER, characterInfo.power),
    // DEFEND
    createCharacterAttribute(event, attributes.DEFEND, characterInfo.defend),
    // AGILITY
    createCharacterAttribute(event, attributes.AGILITY, characterInfo.agility),
    // INTELLIGENCE
    createCharacterAttribute(event, attributes.INTELLIGENCE, characterInfo.intelligence),
    // LUCK
    createCharacterAttribute(event, attributes.LUCK, characterInfo.luck)
  ]
  
  // Update NFT with character-related data
  nft.searchCharacterAccount = characterAccount.contractAddress
  nft.searchCharacterAttribute = attributesArray.map<string>((attr) => attr.id)
  nft.save()
}

export function handleCharacterLevelUp(event: KakarottoCharacterLevelUp): void {
    let character = Character.load(getCharacterId(event.address, event.params.tokenId))

    if (!character) {
        log.warning("Character not found: {}", [getCharacterId(event.address, event.params.tokenId)])
        return
    }

    character.level = event.params.toLevel
    character.save()
}

export function handleCharacterIncreasedExp(event: KakarottoCharacterIncreasedExp): void {
    let character = Character.load(getCharacterId(event.address, event.params.tokenId))

    if (!character) {
        log.warning("Character not found: {}", [getCharacterId(event.address, event.params.tokenId)])
        return
    }

    character.exp = event.params.toExp
    character.save()
}