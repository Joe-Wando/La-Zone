import { useState } from 'react'
import { auth } from '../firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import { Link } from 'react-router-dom'
import { LogoGrand } from '../composants/Logo'

export default function ReinitialisationMotDePasse() {
  const [email, setEmail] = useState("")
  const [envoye, setEnvoye] = useState(false)
  const [erreur, setErreur] = useState("")
  const [chargement, setChargement] = useState(false)

  async function reinitialiser() {
    setErreur("")
    setChargement(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setEnvoye(true)
    } catch (e: any) {
      setErreur("Aucun compte trouve avec cet email.")
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "#0A0A0A" }}>

      <div className="w-full max-w-md rounded-2xl p-10 shadow-2xl"
        style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>

        <div className="mb-8">
          <LogoGrand />
        </div>

        <p className="text-sm mb-1" style={{ color: "#888888" }}>Mot de passe oublie ?</p>
        <h1 className="text-3xl font-bold text-white mb-4">Reinitialisation</h1>
        <p className="text-sm mb-8" style={{ color: "#888888" }}>
          Entrez votre email et on vous envoie un lien de reinitialisation.
        </p>

        {erreur && (
          <div className="px-4 py-3 rounded-xl mb-6 text-sm"
            style={{ backgroundColor: "#E2001A10", border: "1px solid #E2001A30", color: "#E2001A" }}>
            {erreur}
          </div>
        )}

        {envoye ? (
          <div className="px-4 py-6 rounded-xl text-center"
            style={{ backgroundColor: "#00A65110", border: "1px solid #00A65130" }}>
            <p className="font-semibold text-white">Email envoye !</p>
            <p className="text-sm mt-2" style={{ color: "#888888" }}>
              Verifiez votre boite mail.
            </p>
            <Link to="/connexion"
              className="text-sm mt-4 inline-block hover:underline"
              style={{ color: "#00A651" }}>
              Retour a la connexion
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="text-sm mb-1 block" style={{ color: "#888888" }}>Email</label>
              <input type="email" placeholder="votre@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full text-white px-4 py-3 rounded-xl focus:outline-none transition"
                style={{ backgroundColor: "#0A0A0A", border: "1px solid #222222" }} />
            </div>

            <button onClick={reinitialiser} disabled={chargement}
              className="w-full py-3 rounded-xl font-bold transition disabled:opacity-50"
              style={{ backgroundColor: "#00A651", color: "#ffffff" }}>
              {chargement ? "Envoi..." : "ENVOYER LE LIEN"}
            </button>

            <p className="text-center mt-6">
              <Link to="/connexion"
                className="text-sm hover:underline transition"
                style={{ color: "#888888" }}>
                Retour a la connexion
              </Link>
            </p>
          </>
        )}

      </div>
    </div>
  )
}