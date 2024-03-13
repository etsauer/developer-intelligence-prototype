'use client'

import { format } from 'date-fns'

function toSentence(str) {
  return str.split(/([A-Z]|\d)/).map((v, i, arr) => {
    if (!i) return v.charAt(0).toUpperCase() + v.slice(1)
    if (!v) return v
    if (v === '_') return " "
    if (v.length === 1 && v === v.toUpperCase()) {
      const previousCapital = !arr[i - 1] || arr[i - 1] === '_'
      const nextWord = i + 1 < arr.length && arr[i + 1] && arr[i + 1] !== '_'
      const nextTwoCapitalsOrEndOfString = i + 3 > arr.length || !arr[i + 1] && !arr[i + 3]
      if (!previousCapital || nextWord) v = " " + v
      if (nextWord || (!previousCapital && !nextTwoCapitalsOrEndOfString)) v = v.toLowerCase()
    }
    return v
  }).join("")
}

export const MeanTimeToRecoveryTooltip = ({ active, payload, label }) => {

  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col gap-4 w-40 bg-white p-4 rounded-2xl shadow dark:bg-neutral-800">
        <div className="text-black text-lg font-semibold tracking-tight dark:text-white">{format(new Date(label * 1000), "MMM d, y")}</div>
        <div className="flex flex-col gap-2">
          {payload.map((data, index) => (
            <div key={index}>
              <div className="text-xs text-neutral-600 dark:text-neutral-400"><span className="inline-block w-2 h-2 mr-2 rounded-full" style={{ backgroundColor: data.color }}></span>{toSentence(data.name)}</div>
              <div className="text-sm text-black font-semibold dark:text-white">{data.value instanceof Array ? data.value.join('-') : data.value} days</div>              
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}