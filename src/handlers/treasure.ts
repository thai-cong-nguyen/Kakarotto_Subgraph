import { Address, BigInt } from "@graphprotocol/graph-ts"
import { KakarottoTreasure as KakarottoTreasureABI, TransferBatch, TransferSingle } from "../../generated/KakarottoTreasure/KakarottoTreasure"
import { NFT, TreasureAccount } from "../../generated/schema"
import { createOrLoadAccount } from "../modules/account"
import { getCategories } from "../modules/category"
import { cancelActiveOrder, clearNFTOrderProperties, getNFTId } from "../modules/nft"
import { buildTreasureFromNFT, getTokenURI as getTokenURITreasure, isBurn as isBurnTreasure, isMint as isMintTreasure } from "../modules/treasure"
import { createOrLoadTreasureAccount, getTreasureAccountId } from "../modules/treasureAccount"
import { buildCountFromNFT } from "../modules/count"

export function handleTransferBatch(event: TransferBatch): void {
    if (event.params.ids.length == 0 || event.params.values.length == 0) {
        return;
    }
    
    const category = getCategories(event.address.toHexString());
    const nftIds: string[] = [];  // Initialize an empty array to store the nftIds

    // Iterate over the ids to build the nftIds array
    for (let i = 0; i < event.params.ids.length; i++) {
        const id = event.params.ids[i];
        const nftId = getNFTId(category, event.address, id);
        nftIds.push(nftId);
    }

    // Iterate over the nftIds to process each NFT
    for (let index = 0; index < nftIds.length; index++) {
        const nftId = nftIds[index];
        let nft = new NFT(nftId);
        nft.tokenId = event.params.ids[index];
        nft.contractAddress = event.address;
        nft.category = category;
        nft.owner = "";
        // Timestamps
        nft.updatedAt = event.block.timestamp;
        nft.soldAt = null;
        nft.transferredAt = event.block.timestamp;
        // analytics
        nft.sales = 0;
        nft.volume = BigInt.fromI32(0);
        nft.tokenURI = getTokenURITreasure(event.address, event.params.ids[index]);

        // To Transfer
        const toAccount = createOrLoadAccount(event.params.to);
        let toTreasureAccount = createOrLoadTreasureAccount(event.address, Address.fromBytes(toAccount.address), event.params.ids[index]);
        toTreasureAccount.balance = toTreasureAccount.balance.plus(event.params.values[index]);
        toTreasureAccount.save();

        // From Account
        const fromAccount = createOrLoadAccount(event.params.from);
        let fromTreasureAccount = createOrLoadTreasureAccount(event.address, Address.fromBytes(fromAccount.address), event.params.ids[index]);

        if (fromTreasureAccount.balance >= event.params.values[index]) {
            fromTreasureAccount.balance = fromTreasureAccount.balance.minus(event.params.values[index]);
        } else {
            const treasureContract = KakarottoTreasureABI.bind(event.address);
            fromTreasureAccount.balance = treasureContract.balanceOf(Address.fromBytes(fromAccount.address), event.params.ids[index]);
        }
        fromTreasureAccount.save();

        nft.save();
    }
}


export function handleTransferSingle(event: TransferSingle): void {
    if (event.params.id.toString() == "" || event.params.value == BigInt.fromI32(0)) { 
        return
    }   
    
    const category = getCategories(event.address.toHexString())
    const nftId = getNFTId(category, event.address, event.params.id)

    let nft = new NFT(nftId)

    nft.tokenId = event.params.id
    nft.contractAddress = event.address
    nft.category = category
    nft.owner = ""
    // Timestamps
    nft.updatedAt = event.block.timestamp   
    nft.soldAt = null
    nft.transferredAt = event.block.timestamp
    // analytics
    nft.sales = 0
    nft.volume = BigInt.fromI32(0)
    nft.tokenURI = getTokenURITreasure(event.address, event.params.id)

    if (!isBurnTreasure(event)) {
        // To Transfer
        const toAccount = createOrLoadAccount(event.params.to)
        let toTreasureAccount = createOrLoadTreasureAccount(event.address, Address.fromBytes(toAccount.address), event.params.id)
        toTreasureAccount.balance = toTreasureAccount.balance.plus(event.params.value)
        toTreasureAccount.save()
    }

    // Mint Transfer
    if (isMintTreasure(event)) {
        nft.createdAt = event.block.timestamp
        nft.searchIsTreasure = true
        nft.searchTreasureAmount = event.params.value.toI32()
        nft.amount = event.params.value.toI32()
        let metric = buildCountFromNFT(nft)
        metric.save()

        let treasure = buildTreasureFromNFT(nft)
        nft.treasure = treasure.id
        // search indexes
        nft.searchIsTreasure = true
        nft.searchTreasureAmount = event.params.value.toI32()
    }
    // Normal Transfer
    else if (!isMintTreasure(event)) {
        const fromAccount = createOrLoadAccount(event.params.from)
        let fromTreasureAccount = createOrLoadTreasureAccount(Address.fromBytes(event.address), Address.fromBytes(fromAccount.address), event.params.id)
        if (fromTreasureAccount.balance >= event.params.value) {
            fromTreasureAccount.balance = fromTreasureAccount.balance.minus(event.params.value)
        }
        else {
            const treasureContract = KakarottoTreasureABI.bind(event.address)
            fromTreasureAccount.balance = treasureContract.balanceOf(Address.fromBytes(fromAccount.address), event.params.id)
        }
        fromTreasureAccount.save()
    }
    // Burning 
    else if (isBurnTreasure(event)) {
        const fromAccount = createOrLoadAccount(event.params.from)
        let fromTreasureAccount = createOrLoadTreasureAccount(event.address, Address.fromBytes(fromAccount.address), event.params.id)
        if (fromTreasureAccount.balance >= event.params.value) {
            fromTreasureAccount.balance = fromTreasureAccount.balance.minus(event.params.value)
        }
        else {
            const treasureContract = KakarottoTreasureABI.bind(event.address)
            fromTreasureAccount.balance = treasureContract.balanceOf(Address.fromBytes(fromAccount.address), event.params.id)
        }
        let oldNFT = NFT.load(nftId)
        nft.amount = 0
        let metric = buildCountFromNFT(nft)
        metric.treasureTotal = metric.treasureTotal >= event.params.value.toI32() ? metric.treasureTotal - event.params.value.toI32() : 0
        metric.save()

        if (oldNFT != null) {
            oldNFT.searchTreasureAmount = oldNFT.searchTreasureAmount >= event.params.value.toI32() ? oldNFT.searchTreasureAmount - event.params.value.toI32() : 0
            oldNFT.save()
        }
        else {
            nft.searchTreasureAmount = 0
            nft.save()
        }
        
        fromTreasureAccount.save()
        return 
    }
    
    nft.save()
}