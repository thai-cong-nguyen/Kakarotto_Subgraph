import { Address } from '@graphprotocol/graph-ts'
import { Account, Character } from '../../../generated/schema'

export function createAccountFromCharacter(character: Character, accountAddress: Address): Account {
    let account = new Account(character.id)
    // account.contractAddress = accountAddress

    account.save()
    return account
}