import { Address, log, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { KakarottoCharacter as KakarottoCharacterABI, Transfer } from '../../../generated/KakarottoCharacter/KakarottoCharacter'
import { Character, CharacterAccount, NFT } from '../../../generated/schema'

export function getCharacterRarity(contractAddress: Address, tokenId: BigInt): BigInt {
    let contract = KakarottoCharacterABI.bind(contractAddress)
    let tokenRarityCallResult = contract.getCharacterInfo(tokenId)

    if (!tokenRarityCallResult.rarity) {
        log.warning('Can not find rarity', [tokenId.toString(), (changetype<Bytes>(contractAddress)).toHexString()])
        return BigInt.fromI32(0)
    }
    return tokenRarityCallResult.rarity
}

export function getCharacterId(contractAddress: Address, tokenId: BigInt): string {
    let characterId = (changetype<Bytes>(contractAddress)).toHexString() + '-' + tokenId.toString()
    return characterId
}

export function buildCharacterFromNFT(nft: NFT): Character {
    let character = Character.load(nft.id)
    
    if (character == null) {
        character = new Character(nft.id)
        character.exp = BigInt.fromI32(0)
        character.level = BigInt.fromI32(0)
    }
    
    return character
}