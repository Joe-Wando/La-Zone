import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './composants/Navbar'
import Footer from './composants/Footer'
import Acceuil from './pages/Acceuil'
import Films from './pages/Films'
import Reservation from './pages/Reservation'
import Inscription from './pages/Inscription'
import Connexion from './pages/Connexion'
import Dashboard from './pages/Dashboard'
import RouteProtegee from './composants/RouteProtegee'
import Admin from './pages/Admin'
import ConfirmationPaiement from './pages/ConfirmationPaiement'
import PaiementErreur from './pages/PaiementErreur'

export default function App() {
  const [connecte, setConnecte] = useState<boolean | null>(null)

  useEffect(function() {
    setConnecte(!!localStorage.getItem('token'))

    function surChangement() {
      setConnecte(!!localStorage.getItem('token'))
    }

    window.addEventListener('auth-change', surChangement)
    return function() {
      window.removeEventListener('auth-change', surChangement)
    }
  }, [])

  if (connecte === null) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#050B18" }}>
        <p style={{ color: "#8899AA" }}>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {connecte && <Navbar />}

      <div className="flex-1">
        <Routes>
          <Route path="/connexion" element={
            connecte ? <Navigate to="/" /> : <Connexion />
          } />
          <Route path="/inscription" element={
            connecte ? <Navigate to="/" /> : <Inscription />
          } />
          <Route path="/" element={
            connecte ? <Acceuil /> : <Navigate to="/connexion" />
          } />
          <Route path="/films" element={
            <RouteProtegee><Films /></RouteProtegee>
          } />
          <Route path="/reservation/:id" element={
            <RouteProtegee><Reservation /></RouteProtegee>
          } />
          <Route path="/dashboard" element={
            <RouteProtegee><Dashboard /></RouteProtegee>
          } />
          <Route path="/admin" element={
            <RouteProtegee><Admin /></RouteProtegee>
          } />
          <Route path="/paiement/succes" element={
            <RouteProtegee><ConfirmationPaiement /></RouteProtegee>
          } />
          <Route path="/paiement/erreur" element={
            <RouteProtegee><PaiementErreur /></RouteProtegee>
          } />
          <Route path="*" element={<Navigate to="/connexion" />} />
        </Routes>
      </div>

      {connecte && <Footer />}
    </div>
  )
}