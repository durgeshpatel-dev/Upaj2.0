import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

const ComingSoon = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email || !/.+@.+\..+/.test(email)) {
      alert('Please enter a valid email to be notified')
      return
    }
    // Placeholder: in future hook this up to an API
    console.log('📨 Subscribe request for:', email)
    setSubscribed(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-6 inline-flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">🚧</div>
          <h1 className="text-3xl font-bold">Coming Soon</h1>
        </div>

        <p className="text-text-secondary mb-6">
          We're working on this feature and will be releasing it soon. Leave your email and we'll notify you when it's live.
        </p>

        {!subscribed ? (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3 justify-center mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="px-4 py-2 rounded border border-border bg-background-card text-text-primary w-full sm:w-auto"
            />
            <Button type="submit" className="px-4 py-2">Notify Me</Button>
          </form>
        ) : (
          <div className="mb-6 text-status-success">Thanks — we'll let you know when it's ready.</div>
        )}

        <div className="flex items-center justify-center space-x-3">
          <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    </div>
  )
}

export default ComingSoon
