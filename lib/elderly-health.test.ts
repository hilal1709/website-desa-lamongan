import assert from "node:assert/strict"
import test from "node:test"

import { aggregateMeasurementTrend, ageOn, normalizeDiseaseName, parseDiseases, validateElderlyInput, validatePosyanduCheckInput } from "./elderly-health"

test("normalizes disease names and removes duplicates", () => {
  assert.equal(normalizeDiseaseName("  HIPER  TENSI  "), "hiper tensi")
  assert.deepEqual(parseDiseases(["Hipertensi", " hipertensi ", "Diabetes"]), [
    { diseaseName: "Hipertensi", normalizedName: "hipertensi" },
    { diseaseName: "Diabetes", normalizedName: "diabetes" },
  ])
})

test("accepts only elderly citizens and complete positive checks", () => {
  assert.equal(ageOn(new Date("1960-08-21T00:00:00.000Z"), new Date("2026-08-21T00:00:00.000Z")), 66)
  assert.equal(validateElderlyInput({ fullName: "Siti Aminah", dusun: "Dusun Gabang", birthDate: "1950-01-01", address: "RT 01", diseases: ["Hipertensi"] }).fullName, "Siti Aminah")
  assert.throws(() => validateElderlyInput({ fullName: "Rina", dusun: "Dusun Gabang", birthDate: "1980-01-01", address: "RT 01", diseases: [] }))
  assert.equal(validatePosyanduCheckInput({ sessionId: "sesi", elderlyId: "warga", systolic: 120, diastolic: 80, weightKg: 50, heightCm: 150, bloodGlucoseMgDl: 100 }).systolic, 120)
  assert.throws(() => validatePosyanduCheckInput({ sessionId: "sesi", elderlyId: "warga", systolic: 0, diastolic: 80, weightKg: 50, heightCm: 150, bloodGlucoseMgDl: 100 }))
})

test("aggregates monthly measurement trend", () => {
  assert.deepEqual(aggregateMeasurementTrend([
    { sessionDate: new Date("2026-01-10T00:00:00.000Z"), systolic: 120, diastolic: 80, weightKg: 50, heightCm: 150, bloodGlucoseMgDl: 100 },
    { sessionDate: new Date("2026-01-20T00:00:00.000Z"), systolic: 140, diastolic: 90, weightKg: 60, heightCm: 160, bloodGlucoseMgDl: 120 },
  ]), [{ month: "2026-01", systolic: 130, diastolic: 85, weightKg: 55, heightCm: 155, bloodGlucoseMgDl: 110 }])
})
