import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import { Account } from "../../../generated/schema"

export function createOrLoadAccount(accountAddress: Address): Account {
    const accountAddressBytes = changetype<Bytes>(accountAddress)
    let account = Account.load(accountAddressBytes.toHexString())
  
    if (account == null) {
      account = new Account(accountAddressBytes.toHexString()) 
      account.address = accountAddressBytes
      account.sales = BigInt.fromI32(0)
      account.purchases = BigInt.fromI32(0)
      account.earned = BigInt.fromI32(0)
      account.spent = BigInt.fromI32(0)
    }
    
    log.info("Loading account: {}", [
      account.address.toHexString(),
      account.sales.toHexString(),
      account.purchases.toHexString(),
      account.earned.toHexString(),
      account.spent.toHexString(),
    ])
    account.save()
  
    return account
  }