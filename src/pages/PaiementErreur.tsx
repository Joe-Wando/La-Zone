import { useNavigate } from 'react-router-dom'

export default function PaiementErreur() {
  const naviguer = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#0A0A0A" }}>
      <div className="w-full max-w-md rounded-2xl p-10 text-center"
        style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>

        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "#E2001A15", border: "2px solid #E2001A" }}>
          <p className="text-2xl font-bold" style={{ color: "#E2001A" }}>✕</p>
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">Paiement echoue</h2>
        <p className="text-sm mb-8" style={{ color: "#888888" }}>
          Le paiement n'a pas pu etre finalise. Aucun montant n'a ete debite.
        </p>

        <div className="flex flex-col gap-3">
          <button onClick={() => naviguer('/films')}
            className="w-full py-3 rounded-xl font-bold transition"
            style={{ backgroundColor: "#00A651", color: "#ffffff" }}>
            Reessayer une reservation
          </button>
          <button onClick={() => naviguer('/dashboard')}
            className="w-full py-3 rounded-xl font-semibold transition"
            style={{ border: "1px solid #222222", color: "#888888" }}>
            Mon tableau de bord
          </button>
        </div>
      </div>
    </div>
  )
}
