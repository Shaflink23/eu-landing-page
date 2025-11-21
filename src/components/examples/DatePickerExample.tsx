"use client"

import * as React from "react"
import { DatePicker } from "@/components/ui/date-picker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DatePickerExample() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>()
  const [startDate, setStartDate] = React.useState<Date | undefined>()
  const [endDate, setEndDate] = React.useState<Date | undefined>()

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shadcn Date Picker Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic DatePicker */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Basic Date Picker</h3>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder="Select a date"
              label="Travel Date"
              description="Choose your preferred travel date"
            />
            <p className="text-sm text-gray-600">
              Selected: {selectedDate?.toLocaleDateString() || 'No date selected'}
            </p>
          </div>

          {/* Separate Start/End Date Pickers (like in DreamTripForm) */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Travel Date Range (Separate Fields)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="Select start date"
                label="Start Date"
                description="Trip departure date"
                minDate={new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)}
              />
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="Select end date"
                label="End Date"
                description="Trip return date"
                minDate={startDate || new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)}
              />
            </div>
            <p className="text-sm text-gray-600">
              Trip: {startDate?.toLocaleDateString() || 'No start date'} - {endDate?.toLocaleDateString() || 'No end date'}
            </p>
          </div>

          {/* Test Min/Max Dates */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Date Picker with Min/Max</h3>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder="Select a date (minimum 20 days from now)"
              label="Future Travel Date"
              description="Must be at least 20 days in the future"
              minDate={new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}