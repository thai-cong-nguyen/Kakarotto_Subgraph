import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { Account } from "../../../generated/schema"

export function createOrLoadAccount(accountAddress: Address): Account {
    const accountAddressBytes = changetype<Bytes>(accountAddress)
    let account = Account.load(accountAddressBytes.toHexString())
  
    if (account == null) {
      account = new Account(accountAddressBytes.toHexString()) 
      account.address = changetype<Bytes>(accountAddress)
      account.sales = 0
      account.purchases = 0
      account.earned = BigInt.fromI32(0)
      account.spent = BigInt.fromI32(0)
    }
  
    account.save()
  
    return account
  }