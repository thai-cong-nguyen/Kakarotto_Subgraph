
import { KakarottoCharacterCreated, KakarottoCharacterLevelUp, KakarottoCharacter as KakarottoCharacterABI, KakarottoCharacterIncreasedExp, KakarottoCharacter, Transfer } from "../../generated/KakarottoCharacter/KakarottoCharacter"
import { Account, Character, CharacterAccount, CharacterAttribute, NFT } from '../../generated/schema';
import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import { getNFTId } from "../modules/nft";
import { getCategories } from "../modules/category";
import { buildCharacterFromNFT, getCharacterId } from "../modules/character";
import * as rarities from "../modules/nft/rarity";
import { createCharacterAttribute, getCharacterAttributeId } from "../modules/characterAttribute";
import * as attributes from "../modules/attribute/attribute";
import { ERC721 } from "../../generated/templates";
import { buildCount } from "../modules/count";
import * as addresses from "../data/addresses";

export function handleCharacterCreated(event: KakarottoCharacterCreated): void {
    let count = buildCount()
    if (count.characterStarted == BigInt.fromI32(0)) {
        ERC721.create(event.address)
        count.characterStarted = BigInt.fromI32(1)
        count.save()
    }
    log.info("Character Created: {}", [event.params.tokenId.toString()])
    const category = getCategories(event.address)
    const nftId = getNFTId(category, event.address, event.params.tokenId)
    let nft = NFT.load(nftId)
    // if (nft == null) {
    //     log.warning("NFT not found: {}", [nftId])
    //     return
    // }
    if (nft == null) {
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

    let character = buildCharacterFromNFT(nft)
    if (character == null) {
        log.warning("Character not found: {}", [nftId])
        return
    }

    nft.character = character.id
    log.info("Character ID: {}", [character.id])
    let characterAccount = CharacterAccount.load(character.id)
    if (characterAccount) {
        log.error("Character already exists: {}", [character.id, (changetype<Bytes>(event.params.account)).toHexString()])
        return 
    }
    // ERC-6551 Account
    characterAccount = new CharacterAccount(character.id)
    characterAccount.character = character.id
    characterAccount.contractAddress = changetype<Bytes>(event.address)
    characterAccount.save()
    log.info("Character Account created: {}", [characterAccount.id, changetype<Bytes>(characterAccount.contractAddress).toHexString(), characterAccount.character])
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
    createCharacterAttribute(event, attributes.POWER, characterInfo.power, character),
    // DEFEND
    createCharacterAttribute(event, attributes.DEFEND, characterInfo.defend, character),
    // AGILITY
    createCharacterAttribute(event, attributes.AGILITY, characterInfo.agility, character),
    // INTELLIGENCE
    createCharacterAttribute(event, attributes.INTELLIGENCE, characterInfo.intelligence, character),
    // LUCK
    createCharacterAttribute(event, attributes.LUCK, characterInfo.luck, character)
  ]
  
  // Update NFT with character-related data
  nft.searchCharacterAccount = characterAccount.contractAddress
  nft.searchCharacterAttribute = attributesArray.map<string>((attr) => attr.id)
  nft.save()
  character.save()
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