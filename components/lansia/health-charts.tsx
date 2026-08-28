"use client"

import type { ComponentProps } from "react"
import { Bar, Line } from "react-chartjs-2"

import "@/components/infografis/chartjs"

export function HealthBar(props: ComponentProps<typeof Bar>) { return <Bar {...props} /> }
export function HealthLine(props: ComponentProps<typeof Line>) { return <Line {...props} /> }
