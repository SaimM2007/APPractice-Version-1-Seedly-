import { useState } from 'react'

type Props = { current: number, total: number, onBack: () => void, onNext: () => void, onSubmit: () => void, onJump: (question: number) => void }

export default function QuestionFooter({ current, total, onBack, onNext, onSubmit, onJump }: Props) {
  const [open, setOpen] = useState(false)

  let nextLabel = 'Next'
  if (current === total) {
    nextLabel = 'Submit'
  }

  function handleClick() {
    if (current === total) {
      onSubmit()
    } else {
      onNext()
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#dfeec7] border-t border-[#7cab3f] px-4 py-3 flex items-center justify-between text-sm z-50">
      <button onClick={onBack} disabled={current === 1} className="px-5 py-2 rounded-2xl bg-[#7cab3f] hover:bg-[#6ca238] text-white disabled:opacity-50">Back</button>
      <div className="px-6 py-2 rounded-2xl bg-[#2c3e2e] text-white">Question {current} of {total} </div>
      <button onClick={handleClick} className="px-5 py-2 rounded-2xl bg-[#7cab3f] hover:bg-[#6ca238] text-white">{nextLabel}</button>
    </div>
  )
}