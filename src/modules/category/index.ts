import {Address, Bytes, log} from "@graphprotocol/graph-ts"
import * as categories from "./categories"
import * as addresses from "../../data/addresses"

export function getCategories(contractAddress: Address): string { 
    const contractAddressString = (changetype<Bytes>(contractAddress)).toHexString()
    let category = ""
    if (contractAddressString == addresses.KakarottoCharacter) {
        category = categories.CHARACTER
    }
    else if (contractAddressString == addresses.KakarottoTreasure) {
        category = categories.TREASURE
    }
    else if (contractAddressString == addresses.KakarottoItem) {
        category = categories.ITEM
    }
    else {
        log.error('Contract address {} not being monitored', [contractAddressString])
        category = contractAddressString
    }
    return category
 }