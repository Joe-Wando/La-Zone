import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { apiFetch } from '../api'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function ConfirmationPaiement() {
  const naviguer = useNavigate()
  const [searchParams] = useSearchParams()
  const ticketRef = useRef<HTMLDivElement>(null)
  const utilisateur = JSON.parse(localStorage.getItem('user') || '{}')

  const [reservation, setReservation] = useState<any>(null)
  const [tentative, setTentative] = useState(0)
  const [erreur, setErreur] = useState("")
  const [telechargement, setTelechargement] = useState(false)

  useEffect(function() {
    const reservationId = searchParams.get('reservationId')
    if (!reservationId) {
      setErreur("Réservation introuvable dans l'URL de retour.")
      return
    }
    verifier(reservationId, 0)
  }, [])

  async function verifier(reservationId: string, n: number) {
    try {
      const derniere = await apiFetch(`/reservations/${reservationId}`)
      if (derniere.statut === 'confirmed') {
        setReservation(derniere)
      } else if (n < 10) {
        setTentative(n + 1)
        setTimeout(function() { verifier(reservationId, n + 1) }, 3000)
      } else {
        setErreur("La confirmation prend du temps. Vérifiez votre tableau de bord.")
      }
    } catch (e: any) {
      setErreur(e.message)
    }
  }

  async function telechargerTicket() {
    if (!ticketRef.current) return
    setTelechargement(true)
    try {
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: "#111111", scale: 2, useCORS: true, allowTaint: false
      })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("landscape", "mm", "a5")
      const largeur = pdf.internal.pageSize.getWidth()
      const hauteur = pdf.internal.pageSize.getHeight()
      pdf.addImage(imgData, "PNG", 0, 0, largeur, hauteur)
      const numeroTicket = reservation?.tickets?.[0]?.numeroTicket || 'reservation'
      pdf.save(`billet-${numeroTicket}.pdf`)
    } catch (e) {
      console.error("Erreur telechargement", e)
    } finally {
      setTelechargement(false)
    }
  }

  function formaterDateHeure(dateHeure: string) {
    const d = new Date(dateHeure)
    return {
      date: d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
      heure: d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    }
  }

  if (!reservation && !erreur) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: "#0A0A0A" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: "#00A65120", border: "2px solid #00A651" }}>
          <span className="animate-spin text-2xl font-black" style={{ color: "#00A651" }}>⟳</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Confirmation en cours...</h2>
        <p className="text-sm" style={{ color: "#888888" }}>
          {tentative > 0 ? `Tentative ${tentative}/10...` : "Vérification du paiement..."}
        </p>
      </div>
    )
  }

  if (erreur) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#0A0A0A" }}>
        <div className="w-full max-w-md rounded-2xl p-8 text-center"
          style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#FDEF0015", border: "2px solid #FDEF00" }}>
            <p className="text-2xl font-bold" style={{ color: "#FDEF00" }}>!</p>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Confirmation en attente</h2>
          <p className="text-sm mb-6" style={{ color: "#888888" }}>{erreur}</p>
          <button onClick={() => naviguer('/dashboard')}
            className="w-full py-3 rounded-xl font-bold transition"
            style={{ backgroundColor: "#00A651", color: "#ffffff" }}>
            Mon tableau de bord
          </button>
        </div>
      </div>
    )
  }

  const { date, heure } = formaterDateHeure(reservation.showtime?.dateHeure)
  const film = reservation.showtime?.film
  const premierTicket = reservation.tickets?.[0]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ backgroundColor: "#0A0A0A" }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">Paiement confirme !</h2>
        <p className="mt-2" style={{ color: "#888888" }}>Votre billet a ete envoye a {utilisateur.email}</p>
      </div>

      <div ref={ticketRef} className="w-full max-w-2xl rounded-2xl overflow-hidden flex shadow-2xl"
        style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>

        <div className="w-2/5 relative">
          <img src={film?.affiche} alt={film?.titre} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent, #111111)" }}></div>
        </div>

        <div className="relative flex flex-col items-center" style={{ backgroundColor: "#111111" }}>
          <div className="absolute -top-3 w-6 h-6 rounded-full" style={{ backgroundColor: "#0A0A0A" }}></div>
          <div className="h-full mx-3" style={{ borderLeft: "2px dashed #222222" }}></div>
          <div className="absolute -bottom-3 w-6 h-6 rounded-full" style={{ backgroundColor: "#0A0A0A" }}></div>
        </div>

        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#00A651" }}>LAZONE</p>
            <h3 className="text-xl font-extrabold text-white mb-4">{film?.titre}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#888888" }}>Titulaire</p>
                <p className="text-white font-semibold text-sm">{utilisateur.prenom} {utilisateur.nom}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#888888" }}>Places</p>
                <p className="text-white font-semibold text-sm">{reservation.nbPlaces} place{reservation.nbPlaces > 1 ? "s" : ""}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#888888" }}>Date</p>
                <p className="text-white font-semibold text-sm">{date}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#888888" }}>Horaire</p>
                <p className="text-white font-semibold text-sm">{heure}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#888888" }}>Montant</p>
                <p className="font-semibold text-sm" style={{ color: "#00A651" }}>{reservation.prixTotal?.toLocaleString()} FCFA</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#888888" }}>Paiement</p>
                <p className="font-semibold text-sm" style={{ color: "#00A651" }}>NabooPay</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#888888" }}>N° Billet</p>
            <p className="font-mono font-bold" style={{ color: "#00A651" }}>{premierTicket?.numeroTicket}</p>
            {premierTicket?.numeroSiege && (
              <p className="text-xs mt-1" style={{ color: "#888888" }}>Siège : {premierTicket.numeroSiege}</p>
            )}
            {reservation.tickets?.length > 1 && (
              <p className="text-xs mt-1" style={{ color: "#888888" }}>
                +{reservation.tickets.length - 1} autre{reservation.tickets.length > 2 ? "s" : ""} billet{reservation.tickets.length > 2 ? "s" : ""}
              </p>
            )}
            <div className="flex gap-px mt-3">
              {Array.from({ length: 40 }).map(function(_, i) {
                return <div key={i} style={{ width: i % 3 === 0 ? "3px" : "2px", height: "30px", backgroundColor: "#ffffff", opacity: i % 2 === 0 ? 0.9 : 0.3 }}></div>
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8 flex-wrap justify-center">
        <button onClick={telechargerTicket} disabled={telechargement}
          className="px-8 py-3 rounded-full font-semibold transition disabled:opacity-50"
          style={{ backgroundColor: "#00A651", color: "#ffffff" }}>
          {telechargement ? "Generation..." : "Telecharger mon billet"}
        </button>
        <button onClick={() => naviguer("/films")}
          className="px-8 py-3 rounded-full font-semibold transition"
          style={{ border: "1px solid #222222", color: "#888888" }}>
          Voir d'autres films
        </button>
        <button onClick={() => naviguer("/dashboard")}
          className="px-8 py-3 rounded-full font-semibold transition"
          style={{ border: "1px solid #00A651", color: "#00A651" }}>
          Mon espace
        </button>
      </div>
    </div>
  )
}
