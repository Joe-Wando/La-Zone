import { useState } from 'react'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom'
import { LogoGrand } from '../composants/Logo'

export default function Inscription() {
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [email, setEmail] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [erreur, setErreur] = useState("")
  const [chargement, setChargement] = useState(false)
  const [succes, setSucces] = useState(false)
  const navigate = useNavigate()

  async function inscrire() {
    setErreur("")
    setChargement(true)
    try {
      const resultat = await createUserWithEmailAndPassword(auth, email, motDePasse)
      await updateProfile(resultat.user, {
        displayName: prenom + " " + nom
      })
      await sendEmailVerification(resultat.user)
      setSucces(true)
      setTimeout(function() {
        navigate('/')
      }, 3000)
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") {
        setErreur("Cet email est deja utilise.")
      } else if (e.code === "auth/weak-password") {
        setErreur("Le mot de passe doit faire au moins 6 caracteres.")
      } else {
        setErreur("Une erreur est survenue. Reessayez.")
      }
    } finally {
      setChargement(false)
    }
  }

  if (succes) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6"
        style={{ backgroundColor: "#0A0A0A" }}>
        <div className="w-full max-w-md rounded-2xl p-10 shadow-2xl text-center"
          style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>

          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "#00A65120", border: "2px solid #00A651" }}>
            <p className="text-2xl text-white font-bold">✓</p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">
            Compte cree avec succes !
          </h2>
          <p className="text-sm mb-2" style={{ color: '#888888' }}>
            Bienvenue {prenom} {nom} sur LAZONE.
          </p>
          <p className="text-sm mb-6" style={{ color: '#888888' }}>
            Un email de verification a ete envoye a{" "}
            <span style={{ color: '#00A651' }}>{email}</span>.
          </p>

          <div className="rounded-xl px-4 py-3 mb-6"
            style={{ backgroundColor: '#00A65110', border: '1px solid #00A65120' }}>
            <p className="text-xs" style={{ color: '#888888' }}>
              Redirection automatique dans 3 secondes...
            </p>
          </div>

          <button onClick={() => navigate('/')}
            className="w-full py-3 rounded-xl font-semibold transition"
            style={{ backgroundColor: '#00A651', color: '#ffffff' }}>
            Acceder au site maintenant
          </button>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0A0A0A" }}>

      {/* GAUCHE — Logo + accroche */}
      <div className="hidden md:flex w-1/2 flex-col justify-center px-16"
        style={{ backgroundColor: '#111111', borderRight: '1px solid #222222' }}>

        <LogoGrand />

        <div className="mt-16">
          <p className="text-2xl font-bold text-white leading-snug">
            Rejoignez LAZONE
          </p>
          <p className="text-2xl font-bold" style={{ color: '#00A651' }}>
            et reservez en ligne.
          </p>
          <p className="text-sm mt-4 leading-relaxed" style={{ color: '#888888' }}>
            Creez votre compte et reservez vos billets en quelques secondes.
          </p>
        </div>

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
          style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>

          <div className="md:hidden mb-8">
            <LogoGrand />
          </div>

          <p className="text-sm mb-1" style={{ color: "#888888" }}>Bienvenue !</p>
          <h1 className="text-3xl font-bold text-white mb-8">Inscription</h1>

          {erreur && (
            <div className="px-4 py-3 rounded-xl mb-6 text-sm"
              style={{ backgroundColor: "#E2001A10", border: "1px solid #E2001A30", color: "#E2001A" }}>
              {erreur}
            </div>
          )}

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="text-sm mb-1 block" style={{ color: "#888888" }}>Prenom</label>
              <input type="text" placeholder="Moussa"
                value={prenom} onChange={e => setPrenom(e.target.value)}
                className="w-full text-white px-4 py-3 rounded-xl focus:outline-none transition"
                style={{ backgroundColor: "#0A0A0A", border: "1px solid #222222" }} />
            </div>
            <div className="flex-1">
              <label className="text-sm mb-1 block" style={{ color: "#888888" }}>Nom</label>
              <input type="text" placeholder="Diallo"
                value={nom} onChange={e => setNom(e.target.value)}
                className="w-full text-white px-4 py-3 rounded-xl focus:outline-none transition"
                style={{ backgroundColor: "#0A0A0A", border: "1px solid #222222" }} />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm mb-1 block" style={{ color: "#888888" }}>Email</label>
            <input type="email" placeholder="votre@email.com"
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full text-white px-4 py-3 rounded-xl focus:outline-none transition"
              style={{ backgroundColor: "#0A0A0A", border: "1px solid #222222" }} />
          </div>

          <div className="mb-8">
            <label className="text-sm mb-1 block" style={{ color: "#888888" }}>Mot de passe</label>
            <input type="password" placeholder="••••••••"
              value={motDePasse} onChange={e => setMotDePasse(e.target.value)}
              className="w-full text-white px-4 py-3 rounded-xl focus:outline-none transition"
              style={{ backgroundColor: "#0A0A0A", border: "1px solid #222222" }} />
          </div>

          <button onClick={inscrire} disabled={chargement}
            className="w-full py-3 rounded-xl font-bold text-lg transition disabled:opacity-50"
            style={{ backgroundColor: "#00A651", color: "#ffffff" }}>
            {chargement ? "Inscription..." : "S'INSCRIRE"}
          </button>

          <p className="text-sm text-center mt-6" style={{ color: "#888888" }}>
            Deja un compte ?{" "}
            <Link to="/connexion" className="font-semibold hover:underline"
              style={{ color: "#00A651" }}>
              Se connecter
            </Link>
          </p>

        </div>
      </div>

    </div>
  )
}