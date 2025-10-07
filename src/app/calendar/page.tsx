'use client'
import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

export default function CalendarPage() {
  const [value, setValue] = useState(new Date())

  return (
    <main className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
        My Calendar
      </h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <Calendar onChange={setValue} value={value} className="mx-auto" />
        <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
          Selected date: {value.toDateString()}
        </p>
      </div>
    </main>
  )
}
