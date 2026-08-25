import assert from "node:assert/strict"
import test from "node:test"
import { ageInMonths, validateChildCheckInput, validateChildInput } from "./child-health"

test("accepts children aged 0 through 59 months only", () => {
  assert.equal(ageInMonths(new Date("2021-09-25T00:00:00.000Z"), new Date("2026-08-25T00:00:00.000Z")), 59)
  assert.equal(validateChildInput({ fullName: "Budi", gender: "L", dusun: "Dusun Gabang", birthDate: "2026-08-01", address: "RT 01", guardianName: "Ibu Budi", guardianPhone: "0812" }).fullName, "Budi")
  assert.throws(() => validateChildInput({ fullName: "Lama", gender: "L", dusun: "Dusun Gabang", birthDate: "2021-08-01", address: "RT 01", guardianName: "Wali", guardianPhone: "0812" }))
})

test("validates required child measurements and KIA choices", () => {
  assert.equal(validateChildCheckInput({ sessionId: "s", childId: "c", weightKg: 8, heightCm: 72, interventions: ["BCG"], developmentStatus: "Sesuai usia" }).weightKg, 8)
  assert.throws(() => validateChildCheckInput({ sessionId: "s", childId: "c", weightKg: 0, heightCm: 72 }))
})
