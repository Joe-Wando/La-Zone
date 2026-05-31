import React from 'react'
import { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function RouteProtegee({ children: enfants }: { children: React.ReactNode }) {
  const [verification, setVerification] = useState(true)
  const navigate = useNavigate()

  useEffect(function() {
    const desabonner = auth.onAuthStateChanged(function(user) {
      if (!user) {
        navigate('/connexion')  // pas connecté → on redirige
      }
      setVerification(false)    // vérification terminée
    })
    return desabonner
  }, [])

  if (verification) {
    return <p>Chargement...</p>  // on attend la réponse de Firebase
  }

  return enfants  // connecté → on affiche la page
}