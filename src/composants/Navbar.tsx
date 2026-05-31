import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { LogoPetit } from './Logo'

export default function Navbar() {
  const [connecte, setConnecte] = useState(false)
  const [menuOuvert, setMenuOuvert] = useState(false)
  const navigate = useNavigate()

  useEffect(function() {
    const desabonner = auth.onAuthStateChanged(function(user) {
      setConnecte(!!user)
    })
    return desabonner
  }, [])

  async function deconnecter() {
    await signOut(auth)
    navigate('/')
    setMenuOuvert(false)
  }

  return (
    <nav className="px-6 py-4 flex items-center justify-between relative"
      style={{ backgroundColor: '#111111', borderBottom: '1px solid #222222' }}>

      <Link to="/"><LogoPetit /></Link>

      {/* Menu desktop */}
      <div className="hidden md:flex gap-6 items-center">
        <Link to="/" className="text-sm transition hover:text-white" style={{ color: '#888888' }}>Accueil</Link>
        <Link to="/films" className="text-sm transition hover:text-white" style={{ color: '#888888' }}>Films</Link>
        {connecte ? (
          <>
            <Link to="/dashboard" className="text-sm transition hover:text-white" style={{ color: '#888888' }}>Mon espace</Link>
            <button onClick={deconnecter}
              className="text-sm px-5 py-2 rounded font-semibold transition"
              style={{ backgroundColor: '#00A651', color: '#0A0A0A' }}>
              Deconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/connexion" className="text-sm transition hover:text-white" style={{ color: '#888888' }}>Connexion</Link>
            <Link to="/inscription"
              className="text-sm px-5 py-2 rounded font-semibold transition"
              style={{ backgroundColor: '#00A651', color: '#0A0A0A' }}>
              S'inscrire
            </Link>
          </>
        )}
      </div>

      {/* Bouton hamburger mobile */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setMenuOuvert(!menuOuvert)}>
        <div className="w-6 h-0.5 transition-all"
          style={{ backgroundColor: '#ffffff', transform: menuOuvert ? 'rotate(45deg) translate(4px, 4px)' : 'none' }}></div>
        <div className="w-6 h-0.5 transition-all"
          style={{ backgroundColor: '#ffffff', opacity: menuOuvert ? 0 : 1 }}></div>
        <div className="w-6 h-0.5 transition-all"
          style={{ backgroundColor: '#ffffff', transform: menuOuvert ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }}></div>
      </button>

      {/* Menu mobile deroulant */}
      {menuOuvert && (
        <div className="absolute top-full left-0 right-0 z-50 flex flex-col px-6 py-4 gap-4 md:hidden"
          style={{ backgroundColor: '#111111', borderBottom: '1px solid #222222' }}>
          <Link to="/" onClick={() => setMenuOuvert(false)}
            className="text-sm py-2 transition hover:text-white" style={{ color: '#888888' }}>
            Accueil
          </Link>
          <Link to="/films" onClick={() => setMenuOuvert(false)}
            className="text-sm py-2 transition hover:text-white" style={{ color: '#888888' }}>
            Films
          </Link>
          {connecte ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOuvert(false)}
                className="text-sm py-2 transition hover:text-white" style={{ color: '#888888' }}>
                Mon espace
              </Link>
              <button onClick={deconnecter}
                className="text-sm px-5 py-3 rounded font-semibold transition text-left"
                style={{ backgroundColor: '#00A651', color: '#0A0A0A' }}>
                Deconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/connexion" onClick={() => setMenuOuvert(false)}
                className="text-sm py-2 transition hover:text-white" style={{ color: '#888888' }}>
                Connexion
              </Link>
              <Link to="/inscription" onClick={() => setMenuOuvert(false)}
                className="text-sm px-5 py-3 rounded font-semibold transition text-center"
                style={{ backgroundColor: '#00A651', color: '#0A0A0A' }}>
                S'inscrire
              </Link>
            </>
          )}
        </div>
      )}

    </nav>
  )
}