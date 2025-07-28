// client/src/components/Spinner.jsx
import React from 'react'

export function Spinner() {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gray-600" />
    </div>
  )
}
