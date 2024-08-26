import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import * as rarities from '../nft/rarity'
import { KakarottoTreasure as KakarottoTreasureABI, TransferSingle } from "../../../generated/KakarottoTreasure/KakarottoTreasure"
import * as addresses from '../../data/addresses'
import { NFT, Treasure } from "../../../generated/schema"

export function getTreasureRarity(
    contractAddress: Address,
    tokenId: BigInt
): string {
    switch (tokenId.toI32()) {
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

export function getTreasureId(
    contractAddress: Address,
    tokenId: BigInt
): string {
    return (changetype<Bytes>(contractAddress)).toHexString() + "-" + tokenId.toString()
}

export function isMint(event: TransferSingle): boolean {
    return (changetype<Bytes>(event.params.from)).toHexString() == addresses.ZERO_ADDRESS
}

export function isBurn(event: TransferSingle): boolean {
    return (changetype<Bytes>(event.params.to)).toHexString() == addresses.ZERO_ADDRESS
}

export function getTokenURI(contractAddress: Address, tokenId: BigInt): string {
    let contract = KakarottoTreasureABI.bind(contractAddress)
    let tokenURICallResult = contract.try_uri(tokenId)
    let tokenURI = ''
    if (tokenURICallResult.reverted) {
        log.warning('tokenURI call reverted for token {}', [tokenId.toString()])
    }
    else {
        tokenURI = tokenURICallResult.value
    }
    return tokenURI
}

export function buildTreasureFromNFT(nft: NFT): Treasure {
    let treasure = new Treasure(nft.id)

    // Treasure

    return treasure
}