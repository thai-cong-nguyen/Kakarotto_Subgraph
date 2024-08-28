import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { KakarottoTreasure as KakarottoTreasureABI, TransferBatch, TransferSingle } from "../../generated/KakarottoTreasure/KakarottoTreasure"
import { NFT, Treasure, TreasureAccount } from "../../generated/schema"
import { createOrLoadAccount } from "../modules/account"
import { getCategories } from "../modules/category"
import { cancelActiveOrder, clearNFTOrderProperties, getNFTId } from "../modules/nft"
import { buildTreasureFromNFT, getTokenURI as getTokenURITreasure, isBurn as isBurnTreasure, isMint as isMintTreasure } from "../modules/treasure"
import { createOrLoadTreasureAccount, getTreasureAccountId } from "../modules/treasureAccount"
import { buildCountFromNFT } from "../modules/count"
import * as rarities from "../modules/nft/rarity"
import * as categories from "../modules/category/categories"

export function handleTransferBatch(event: TransferBatch): void {
    if (event.params.ids.length == 0 || event.params.values.length == 0) {
        return
    }
    
    const category = getCategories(event.address)
    const nftIds: string[] = []  // Initialize an empty array to store the nftIds

    // Iterate over the ids to build the nftIds array
    for (let i = 0; i < event.params.ids.length; i++) {
        const id = event.params.ids[i]
        const nftId = getNFTId(category, event.address, id)
        nftIds.push(nftId)
    }

    // Iterate over the nftIds to process each NFT
    for (let index = 0; index < nftIds.length; index++) {
        const nftId = nftIds[index]
        let nft = new NFT(nftId)
        nft.tokenId = event.params.ids[index]
        nft.contractAddress = changetype<Bytes>(event.address)
        nft.category = category
        nft.owner = ""
        // Timestamps
        nft.updatedAt = event.block.timestamp
        nft.soldAt = null
        nft.transferredAt = event.block.timestamp
        // analytics
        nft.sales = BigInt.fromI32(0)
        nft.volume = BigInt.fromI32(0)
        nft.tokenURI = getTokenURITreasure(event.address, event.params.ids[index])

        // To Transfer
        const toAccount = createOrLoadAccount(event.params.to)
        let toTreasureAccount = createOrLoadTreasureAccount(event.address, changetype<Address>(toAccount.address), event.params.ids[index])
        toTreasureAccount.balance = toTreasureAccount.balance.plus(event.params.values[index])
        toTreasureAccount.save()

        // From Account
        const fromAccount = createOrLoadAccount(event.params.from)
        let fromTreasureAccount = createOrLoadTreasureAccount(event.address, changetype<Address>(fromAccount.address), event.params.ids[index])

        if (fromTreasureAccount.balance >= event.params.values[index]) {
            fromTreasureAccount.balance = fromTreasureAccount.balance.minus(event.params.values[index])
        } else {
            const treasureContract = KakarottoTreasureABI.bind(event.address)
            fromTreasureAccount.balance = treasureContract.balanceOf(changetype<Address>(fromAccount.address), event.params.ids[index])
        }
        fromTreasureAccount.save()

        nft.save()
    }
}   

export function handleTransferSingle(event: TransferSingle): void {
    if (event.params.id.toString() == "" || event.params.value == BigInt.fromI32(0)) { 
        return
    }   
    
    const category = getCategories(event.address)
    const nftId = getNFTId(category, event.address, event.params.id)

    let owner = createOrLoadAccount(event.params.operator)

    let nft = NFT.load(nftId)
    if (!nft) {
        nft = new NFT(nftId)
        nft.tokenId = event.params.id
        nft.contractAddress = changetype<Bytes>(event.address)
        nft.category = category
        nft.creator = changetype<Bytes>(owner.address)
        nft.owner = changetype<Bytes>(owner.address).toHexString()
        nft.amount = event.params.value
        nft.soldAt = null
        // analytics
        nft.sales = BigInt.fromI32(0)
        nft.volume = BigInt.fromI32(0)
        nft.tokenURI = getTokenURITreasure(event.address, event.params.id)

    }
    nft.updatedAt = event.block.timestamp   
    nft.transferredAt = event.block.timestamp
    
    if (!isBurnTreasure(event)) {
        // To Transfer
        let toAccount = createOrLoadAccount(event.params.to)
        let toTreasureAccount = createOrLoadTreasureAccount(event.address, changetype<Address>(toAccount.address), event.params.id)
        toTreasureAccount.balance = toTreasureAccount.balance.plus(event.params.value)
        toTreasureAccount.save()
    }

    // Mint Transfer
    if (isMintTreasure(event)) {
        nft.createdAt = event.block.timestamp
        nft.amount = event.params.value
        // Rarity
        switch (event.params.id.toI32()) {
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
        let metric = buildCountFromNFT(nft)
        metric.save()
        
        let treasure = buildTreasureFromNFT(nft)
        treasure.save()
        nft.treasure = treasure.id
        // search indexes
        nft.searchIsTreasure = true
    }
    // Normal Transfer
    else if (!isMintTreasure(event)) {
        let fromAccount = createOrLoadAccount(event.params.from)
        let fromTreasureAccount = createOrLoadTreasureAccount(event.address, changetype<Address>(fromAccount.address), event.params.id)
        fromTreasureAccount.balance = fromTreasureAccount.balance.minus(event.params.value)
        fromTreasureAccount.save()
    }
    // Burning 
    else if (isBurnTreasure(event)) {
        let fromAccount = createOrLoadAccount(event.params.from)
        let fromTreasureAccount = createOrLoadTreasureAccount(event.address, changetype<Address>(fromAccount.address), event.params.id)
        fromTreasureAccount.balance = fromTreasureAccount.balance.minus(event.params.value)
        fromTreasureAccount.save()
        let metric = buildCountFromNFT(nft)
        metric.treasureTotal = metric.treasureTotal.minus(event.params.value)
        metric.save()
    }
    
    nft.save()
}