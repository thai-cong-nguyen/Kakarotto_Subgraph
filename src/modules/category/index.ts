import {log} from "@graphprotocol/graph-ts"
import * as categories from "./categories"
import * as addresses from "../../data/addresses"

export function getCategories(contractAddress: string): string { 
    let category = ""
    switch (contractAddress) {
        case addresses.KakarottoCharacter:
            category = categories.CHARACTER
            break
        case addresses.KakarottoTreasure:
            category = categories.TREASURE
            break
        case addresses.KakarottoItem:
            category = categories.ITEM
            break
        default:
            log.warning('Contract address {} not being monitored', [contractAddress])
            category = contractAddress
            break
    }
    return category
 }