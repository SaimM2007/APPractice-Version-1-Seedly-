import React from 'react'

export default function QuestionCard({ question, options, selected, onSelect, questionNumber }: { question: string, options: string[], selected: number | null, onSelect: (index: number) => void, questionNumber: number }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-2xl w-full">
      <div className="text-sm text-[#89b02e] font-medium mb-2">
        Question {questionNumber}
      </div>

      <h2 className="text-lg font-semibold text-[#2c3e2e] mb-4">
        {question}
      </h2>

      <div className="flex flex-col gap-3 mb-6">
        {options.map((option, index) => {
          let containerClass = 'flex items-center gap-4 px-4 py-2 rounded-md transition border-2 '
          let circleClass = 'w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold border-2 '

          if (selected === index) {
            containerClass += 'border-[#89b02e] bg-[#f4f6ee] text-[#2c3e2e]'
            circleClass += 'bg-[#7cab3f] text-white border-[#7cab3f]'
          } else {
            containerClass += 'border-[#d0d7c9] bg-[#f4f6ee] text-[#2c3e2e] hover:border-[#89b02e]'
            circleClass += 'text-[#2c3e2e] border-[#d0d7c9]'
          }

          const letter = String.fromCharCode(65 + index)

          return (
            <button key={index} className={containerClass} onClick={() => onSelect(index)}><div className={circleClass}>{letter}</div><span>{option}</span></button>
          )
        })}
      </div>
    </div>
  )
}