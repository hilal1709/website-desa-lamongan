import assert from "node:assert/strict"
import test from "node:test"

import { PopulationEventType } from "@/generated/prisma/client"
import { calculatePopulationByHamlet, calculatePopulationDemographics, summarizePopulationFlow } from "./population-calculations"
import { createXlsx } from "./xlsx-export"

const date = (value: string) => new Date(`${value}T00:00:00.000Z`)

test("summarizePopulationFlow calculates natural, migration, and net changes", () => {
  const result = summarizePopulationFlow([
    { eventDate: date("2026-01-01"), dusun: "Dusun Topang", type: PopulationEventType.KELAHIRAN },
    { eventDate: date("2026-01-02"), dusun: "Dusun Topang", type: PopulationEventType.KELAHIRAN },
    { eventDate: date("2026-01-03"), dusun: "Dusun Topang", type: PopulationEventType.KEMATIAN },
    { eventDate: date("2026-01-04"), dusun: "Dusun Topang", type: PopulationEventType.PINDAH_MASUK },
    { eventDate: date("2026-01-05"), dusun: "Dusun Topang", type: PopulationEventType.PINDAH_KELUAR },
    { eventDate: date("2026-01-06"), dusun: "Dusun Topang", type: PopulationEventType.PINDAH_KELUAR },
  ])

  assert.deepEqual(result.counts, { KELAHIRAN: 2, KEMATIAN: 1, PINDAH_MASUK: 1, PINDAH_KELUAR: 2 })
  assert.equal(result.naturalChange, 1)
  assert.equal(result.netMigration, -1)
  assert.equal(result.netChange, 0)
})

test("calculatePopulationByHamlet keeps events before a hamlet's opening balance out of the total", () => {
  const population = calculatePopulationByHamlet(
    [
      { dusun: "Dusun Gabang", effectiveDate: date("2026-01-01"), totalPopulation: 100 },
      { dusun: "Dusun Topang", effectiveDate: date("2026-02-01"), totalPopulation: 50 },
    ],
    [
      { eventDate: date("2025-12-31"), dusun: "Dusun Gabang", type: PopulationEventType.KELAHIRAN },
      { eventDate: date("2026-01-15"), dusun: "Dusun Gabang", type: PopulationEventType.PINDAH_MASUK },
      { eventDate: date("2026-01-25"), dusun: "Dusun Gabang", type: PopulationEventType.KEMATIAN },
      { eventDate: date("2026-01-31"), dusun: "Dusun Topang", type: PopulationEventType.KELAHIRAN },
      { eventDate: date("2026-02-03"), dusun: "Dusun Topang", type: PopulationEventType.PINDAH_KELUAR },
    ],
  )

  assert.deepEqual(population, [
    { dusun: "Dusun Gabang", totalPopulation: 100 },
    { dusun: "Dusun Topang", totalPopulation: 49 },
  ])
})

test("calculatePopulationDemographics applies event direction to gender and age group", () => {
  const demographics = calculatePopulationDemographics(
    [{
      dusun: "Dusun Topang",
      effectiveDate: date("2026-01-01"),
      totalPopulation: 10,
      demographics: [
        { ageGroup: "0–5", gender: "Laki-laki", total: 2 },
        { ageGroup: "0–5", gender: "Perempuan", total: 1 },
        { ageGroup: "6–17", gender: "Laki-laki", total: 1 },
        { ageGroup: "6–17", gender: "Perempuan", total: 1 },
        { ageGroup: "18–35", gender: "Laki-laki", total: 1 },
        { ageGroup: "18–35", gender: "Perempuan", total: 1 },
        { ageGroup: "36–59", gender: "Laki-laki", total: 1 },
        { ageGroup: "36–59", gender: "Perempuan", total: 1 },
        { ageGroup: "60+", gender: "Laki-laki", total: 0 },
        { ageGroup: "60+", gender: "Perempuan", total: 0 },
      ],
    }],
    [
      { eventDate: date("2026-02-01"), dusun: "Dusun Topang", type: PopulationEventType.KELAHIRAN, gender: "Perempuan", birthDate: date("2026-02-01") },
      { eventDate: date("2026-03-01"), dusun: "Dusun Topang", type: PopulationEventType.PINDAH_KELUAR, gender: "Laki-laki", birthDate: date("2000-01-01") },
    ],
    date("2026-12-31"),
  )

  assert.equal(demographics.male, 4)
  assert.equal(demographics.female, 5)
  assert.deepEqual(demographics.rows[0], { ageGroup: "0–5", male: 2, female: 2 })
  assert.deepEqual(demographics.rows[2], { ageGroup: "18–35", male: 0, female: 1 })
})

test("createXlsx emits a workbook archive with the public-detail worksheet", () => {
  const workbook = createXlsx([["Tanggal peristiwa", "Nama"], ["2026-01-01", "Warga Kedungrejo"]])
  assert.equal(workbook.readUInt32LE(0), 0x04034b50)
  assert.match(workbook.toString("latin1"), /xl\/workbook\.xml/)
  assert.match(workbook.toString("latin1"), /xl\/worksheets\/sheet1\.xml/)
})
