import { Address, BigInt } from "@graphprotocol/graph-ts"
import { Account } from "../../../generated/schema"

export function createOrLoadAccount(id: Address): Account {
    let account = Account.load(id.toHex())
  
    if (account == null) {
      account = new Account(id.toHex())
      account.address = id
      account.sales = 0
      account.purchases = 0
      account.earned = BigInt.fromI32(0)
      account.spent = BigInt.fromI32(0)
    }
  
    account.save()
  
    return account!
  }