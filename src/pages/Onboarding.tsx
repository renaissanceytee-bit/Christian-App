import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Onboarding(){
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({
    name: localStorage.getItem('profile_name') || '',
    goal: localStorage.getItem('profile_goal') || 'Learn the basics',
    background: localStorage.getItem('user_background') || '',
    study_time: localStorage.getItem('user_study_time') || '',
    reminder: localStorage.getItem('reminder_time') ? true : false,
    reminder_time: localStorage.getItem('reminder_time') || '09:00'
  })

  const questions = [
    {
      id: 'name',
      type: 'text',
      question: 'What is your name?',
      placeholder: 'Enter your name (optional)...',
    },
    {
      id: 'background',
      type: 'mc',
      question: 'What is your background with Christianity?',
      options: [
        'I have no experience',
        'Curious but new',
        'Growing up in it',
        'Already practicing',
        'Returning after time away',
      ],
    },
    {
      id: 'goal',
      type: 'mc',
      question: 'What brings you here?',
      options: [
        'Learn the basics',
        'Deepen my faith',
        'Answer personal questions',
        'Build a daily practice',
        'Just exploring',
      ],
    },
    {
      id: 'study_time',
      type: 'mc',
      question: 'How much time can you commit weekly?',
      options: [
        'Less than 1 hour',
        '1-3 hours',
        '3-5 hours',
        'More than 5 hours',
      ],
    },
    {
      id: 'reminder',
      type: 'toggle',
      question: 'Would you like daily study reminders?',
    },
    {
      id: 'reminder_time',
      type: 'time',
      question: 'What time works best for reminders?',
      defaultValue: '09:00',
    },
  ]

  const currentQuestion = questions[step]
  const shouldSkipReminderTime = step > 0 && questions[step - 1].id === 'reminder' && answers.reminder === false

  const handleAnswer = (value: any) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(newAnswers)

    if (step < questions.length - 1) {
      const nextStep = step + 1
      // Skip reminder time question if reminders disabled
      if (currentQuestion.id === 'reminder' && value === false) {
        setStep(nextStep + 1)
        return
      }
      setStep(nextStep)
    }
  }

  const handleComplete = () => {
    // Save onboarding data
    localStorage.setItem('profile_name', answers.name || '')
    localStorage.setItem('user_background', answers.background || '')
    localStorage.setItem('profile_goal', answers.goal || 'Learn the basics')
    localStorage.setItem('user_study_time', answers.study_time || '')
    if (answers.reminder) {
      localStorage.setItem('reminder_time', answers.reminder_time || '09:00')
    } else {
      localStorage.removeItem('reminder_time')
    }
    localStorage.setItem('onboarded', '1')

    // request notification permission if they agreed to be reminded
    if(answers.reminder && Notification && Notification.permission !== 'granted'){
      Notification.requestPermission().then(p=>{
        if(p==='granted'){
          new Notification('Reminders enabled', {body: 'We will remind you to study while the app is open.'})
        }
      })
    }

    navigate('/')
  }

  const progress = ((step + 1) / questions.length) * 100

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Welcome to Christian Study!</h1>
        <p style={{ color: '#666', fontSize: '0.95rem' }}>
          Let's personalize your learning journey (Step {step + 1} of {questions.length})
        </p>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '4px',
          backgroundColor: '#e0e0e0',
          borderRadius: '2px',
          marginBottom: '2rem',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#4CAF50',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Question Display */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: '#333' }}>
          {currentQuestion.question}
        </h2>

        {currentQuestion.type === 'text' && (
          <input
            type="text"
            placeholder={currentQuestion.placeholder}
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && answers[currentQuestion.id]) {
                if (step < questions.length - 1) setStep(step + 1)
              }
            }}
            autoFocus
          />
        )}

        {currentQuestion.type === 'mc' && (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {currentQuestion.options?.map((option: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  border: answers[currentQuestion.id] === option ? '2px solid #4CAF50' : '1px solid #ddd',
                  backgroundColor: answers[currentQuestion.id] === option ? '#f0f9f0' : '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  fontWeight: answers[currentQuestion.id] === option ? 'bold' : 'normal',
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'toggle' && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => handleAnswer(true)}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: answers[currentQuestion.id] === true ? '2px solid #4CAF50' : '1px solid #ddd',
                backgroundColor: answers[currentQuestion.id] === true ? '#f0f9f0' : '#fff',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              Yes
            </button>
            <button
              onClick={() => handleAnswer(false)}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: answers[currentQuestion.id] === false ? '2px solid #e53935' : '1px solid #ddd',
                backgroundColor: answers[currentQuestion.id] === false ? '#ffebee' : '#fff',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              No
            </button>
          </div>
        )}

        {currentQuestion.type === 'time' && (
          <input
            type="time"
            value={answers[currentQuestion.id] || currentQuestion.defaultValue}
            onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#e0e0e0',
            border: 'none',
            borderRadius: '4px',
            cursor: step === 0 ? 'not-allowed' : 'pointer',
            opacity: step === 0 ? 0.5 : 1,
          }}
        >
          Back
        </button>

        {step === questions.length - 1 ? (
          <button
            onClick={handleComplete}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            Start Learning
          </button>
        ) : (
          <button
            onClick={() => handleAnswer(answers[currentQuestion.id])}
            disabled={!answers[currentQuestion.id]}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: answers[currentQuestion.id] ? 'pointer' : 'not-allowed',
              opacity: answers[currentQuestion.id] ? 1 : 0.5,
            }}
          >
            Next
          </button>
        )}
      </div>

      {/* Info Box */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          fontSize: '0.9rem',
          color: '#666',
        }}
      >
        <strong>About this course:</strong> Short lessons designed to help you understand Christianity at your own pace. Start free—all units available!
      </div>
    </div>
  )
}
