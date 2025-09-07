import React from 'react'
import ProfileCard from '../components/profile/ProfileCard'
import PersonalInfoForm from '../components/profile/PersonalInfoForm'
import FarmDetailsForm from '../components/profile/FarmDetailsForm'
import PastPredictionsList from '../components/profile/PastPredictionsList'
import { Tr } from '../components/ui/SimpleTranslation'

const Profile = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <main className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary"><Tr>Profile</Tr></h1>
          <p className="mt-2 text-text-secondary"><Tr>Manage your account, settings, and farm details.</Tr></p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <ProfileCard />
          
          <div className="space-y-6">
            <PersonalInfoForm />
            <FarmDetailsForm />
          </div>
        </div>

        <div className="mt-8">
          {/* <PastPredictionsList /> */}
        </div>
      </main>
    </div>
  )
}

export default Profile
