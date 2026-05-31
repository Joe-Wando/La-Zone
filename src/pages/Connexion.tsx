import { useState } from 'react'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom'

function Logo() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-4">
        {/* Grille 3x3 */}
        <div className="grid grid-cols-3 gap-1">
          <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: '#00A651' }}></div>
          <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: '#00A651' }}></div>
          <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: '#FDEF00' }}></div>
          <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: '#00A651' }}></div>
          <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: '#0A0A0A', border: '1px solid #222222' }}></div>
          <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: '#0A0A0A', border: '1px solid #222222' }}></div>
          <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: '#E2001A' }}></div>
          <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: '#E2001A' }}></div>
          <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: '#E2001A' }}></div>
        </div>

        {/* Texte + ligne tricolore */}
        <div>
          <p style={{ fontFamily: 'Arial', fontWeight: 900, fontSize: '36px', letterSpacing: '6px', color: '#ffffff', lineHeight: 1 }}>
            LAZONE
          </p>
          <div className="flex mt-1">
            <div className="h-1 w-12" style={{ backgroundColor: '#00A651' }}></div>
            <div className="h-1 w-12" style={{ backgroundColor: '#FDEF00' }}></div>
            <div className="h-1 w-12" style={{ backgroundColor: '#E2001A' }}></div>
          </div>
        </div>
      </div>

      <p className="mt-2 text-xs tracking-widest" style={{ color: '#888888', letterSpacing: '4px' }}>
        PLATEFORME DE RESERVATION CINEMA
      </p>
    </div>
  )
}

export default function Connexion() {
  const [email, setEmail] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [erreur, setErreur] = useState("")
  const [chargement, setChargement] = useState(false)
  const navigate = useNavigate()

  async function connecter() {
    setErreur("")
    setChargement(true)
    try {
      await signInWithEmailAndPassword(auth, email, motDePasse)
      navigate('/')
    } catch (e: any) {
      setErreur("Email ou mot de passe incorrect.")
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0A0A0A' }}>

      {/* GAUCHE — Logo + accroche */}
      <div className="hidden md:flex w-1/2 flex-col justify-center px-16"
        style={{ backgroundColor: '#111111', borderRight: '1px solid #222222' }}>

        <Logo />

        <div className="mt-16">
          <p className="text-2xl font-bold text-white leading-snug">
            Le cinema senegalais
          </p>
          <p className="text-2xl font-bold" style={{ color: '#00A651' }}>
            a portee de clic.
          </p>
          <p className="text-sm mt-4 leading-relaxed" style={{ color: '#888888' }}>
            Reservez vos places pour les meilleurs films africains et internationaux.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-10 mt-12">
          <div>
            <p className="text-3xl font-bold" style={{ color: '#00A651' }}>100+</p>
            <p className="text-xs mt-1" style={{ color: '#888888' }}>Films disponibles</p>
          </div>
          <div>
            <p className="text-3xl font-bold" style={{ color: '#FDEF00' }}>5 min</p>
            <p className="text-xs mt-1" style={{ color: '#888888' }}>Pour reserver</p>
          </div>
          <div>
            <p className="text-3xl font-bold" style={{ color: '#E2001A' }}>100%</p>
            <p className="text-xs mt-1" style={{ color: '#888888' }}>En ligne</p>
          </div>
        </div>

      </div>

      {/* DROITE — Formulaire */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-8">
        <div className="w-full max-w-md rounded-2xl p-10 shadow-2xl"
          style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>

          {/* Logo mobile uniquement */}
          <div className="md:hidden mb-8">
            <Logo />
          </div>

          <p className="text-sm mb-1" style={{ color: '#888888' }}>Bon retour parmi nous</p>
          <h1 className="text-3xl font-bold text-white mb-8">Connexion</h1>

          {erreur && (
            <div className="px-4 py-3 rounded-xl mb-6 text-sm"
              style={{ backgroundColor: '#E2001A10', border: '1px solid #E2001A30', color: '#E2001A' }}>
              {erreur}
            </div>
          )}

          <div className="mb-4">
            <label className="text-sm mb-1 block" style={{ color: '#888888' }}>Email</label>
            <input type="email" placeholder="votre@email.com"
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full text-white px-4 py-3 rounded-xl focus:outline-none transition"
              style={{ backgroundColor: '#0A0A0A', border: '1px solid #222222' }} />
          </div>

          <div className="mb-2">
            <label className="text-sm mb-1 block" style={{ color: '#888888' }}>Mot de passe</label>
            <input type="password" placeholder="••••••••"
              value={motDePasse} onChange={e => setMotDePasse(e.target.value)}
              className="w-full text-white px-4 py-3 rounded-xl focus:outline-none transition"
              style={{ backgroundColor: '#0A0A0A', border: '1px solid #222222' }} />
          </div>

          <div className="text-right mb-8">
            <Link to="/reinitialisation"
              className="text-sm hover:underline transition"
              style={{ color: '#00A651' }}>
              Mot de passe oublie ?
            </Link>
          </div>

          <button onClick={connecter} disabled={chargement}
            className="w-full py-3 rounded-xl font-bold text-lg transition disabled:opacity-50"
            style={{ backgroundColor: '#00A651', color: '#ffffff' }}>
            {chargement ? "Connexion..." : "SE CONNECTER"}
          </button>

          <p className="text-sm text-center mt-6" style={{ color: '#888888' }}>
            Pas encore de compte ?{" "}
            <Link to="/inscription"
              className="font-semibold hover:underline"
              style={{ color: '#00A651' }}>
              S'inscrire
            </Link>
          </p>

        </div>
      </div>

    </div>
  )
}