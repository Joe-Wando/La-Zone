import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RouteProtegee({ children: enfants }: { children: React.ReactNode }) {
  const [verification, setVerification] = useState(true)
  const navigate = useNavigate()

  useEffect(function() {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/connexion')
    }
    setVerification(false)
  }, [])

  if (verification) {
    return <p>Chargement...</p>
  }

  return enfants
}