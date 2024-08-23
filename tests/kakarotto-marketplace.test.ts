import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { ChangeFeeCollector } from "../generated/schema"
import { ChangeFeeCollector as ChangeFeeCollectorEvent } from "../generated/KakarottoMarketplace/KakarottoMarketplace"
import { handleChangeFeeCollector } from "../src/kakarotto-marketplace"
import { createChangeFeeCollectorEvent } from "./kakarotto-marketplace-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let feeCollector = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newChangeFeeCollectorEvent = createChangeFeeCollectorEvent(feeCollector)
    handleChangeFeeCollector(newChangeFeeCollectorEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ChangeFeeCollector created and stored", () => {
    assert.entityCount("ChangeFeeCollector", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ChangeFeeCollector",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "feeCollector",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
