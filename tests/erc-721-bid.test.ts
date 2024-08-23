import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes, Address, BigInt } from "@graphprotocol/graph-ts"
import { BidAccepted } from "../generated/schema"
import { BidAccepted as BidAcceptedEvent } from "../generated/ERC721Bid/ERC721Bid"
import { handleBidAccepted } from "../src/erc-721-bid"
import { createBidAcceptedEvent } from "./erc-721-bid-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let _id = Bytes.fromI32(1234567890)
    let _tokenAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let _tokenId = BigInt.fromI32(234)
    let _bidder = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let _seller = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let _price = BigInt.fromI32(234)
    let _fee = BigInt.fromI32(234)
    let newBidAcceptedEvent = createBidAcceptedEvent(
      _id,
      _tokenAddress,
      _tokenId,
      _bidder,
      _seller,
      _price,
      _fee
    )
    handleBidAccepted(newBidAcceptedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BidAccepted created and stored", () => {
    assert.entityCount("BidAccepted", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BidAccepted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_id",
      "1234567890"
    )
    assert.fieldEquals(
      "BidAccepted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_tokenAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "BidAccepted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_tokenId",
      "234"
    )
    assert.fieldEquals(
      "BidAccepted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_bidder",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "BidAccepted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_seller",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "BidAccepted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_price",
      "234"
    )
    assert.fieldEquals(
      "BidAccepted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_fee",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
