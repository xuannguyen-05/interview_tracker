import { useState, useEffect } from "react"

export default function AnimatedHeader({ subtitle, title }) {
  const [isVisible, setIsVisible] = useState(false)
  const [titleText, setTitleText] = useState("")

  useEffect(() => {
    setIsVisible(true)
    
    // Typing animation for title
    if (title) {
      let index = 0
      const interval = setInterval(() => {
        if (index < title.length) {
          setTitleText(title.slice(0, index + 1))
          index++
        } else {
          clearInterval(interval)
        }
      }, 50)
      
      return () => clearInterval(interval)
    }
  }, [title])

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
        <div>
          <p className={`text-sm font-medium text-indigo-600 transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
            {subtitle}
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            {titleText}
            <span className="inline-block w-0.5 h-6 bg-indigo-600 ml-1 animate-pulse" />
          </h1>
        </div>
      </div>
    </header>
  )
}
