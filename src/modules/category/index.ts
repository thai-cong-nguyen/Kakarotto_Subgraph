import {log} from "@graphprotocol/graph-ts"
import * as categories from "./categories"
import * as addresses from "../../data/addresses"

export function getCategories(contractAddress: string): string { 
    let category = ""
    if (contractAddress == addresses.KakarottoCharacter) {
        category = categories.CHARACTER
    }
    else if (contractAddress == addresses.KakarottoTreasure) {
        category = categories.TREASURE
    }
    else if (contractAddress == addresses.KakarottoItem) {
        category = categories.ITEM
    }
    else {
        log.warning('Contract address {} not being monitored', [contractAddress])
        category = contractAddress
    }
    return category
 }