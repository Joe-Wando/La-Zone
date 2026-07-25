import { useParams } from "react-router-dom"
import { useFilms } from "../hooks/useFilms"
import { useState, useEffect } from "react"
import { apiFetch } from "../api"

export default function Reservation() {
  const { id } = useParams()
  const { films, chargement } = useFilms()

  const film = films.find(f => f.id === id)

  const [seances, setSeances] = useState<any[]>([])
  const [seanceSelectionnee, setSeanceSelectionnee] = useState<string>("")
  const [chargementSeances, setChargementSeances] = useState(true)
  const [nbPlaces, setNbPlaces] = useState(1)
  const [erreur, setErreur] = useState("")
  const [chargementPaiement, setChargementPaiement] = useState(false)

  useEffect(function() {
    if (!id) return
    async function chargerSeances() {
      try {
        const data = await apiFetch(`/showtimes?filmId=${id}`)
        setSeances(data)
        if (data.length > 0) setSeanceSelectionnee(data[0].id)
      } catch (e) {
        console.error("Erreur chargement séances", e)
      } finally {
        setChargementSeances(false)
      }
    }
    chargerSeances()
  }, [id])

  const seanceActive = seances.find(s => s.id === seanceSelectionnee)
  const montantTotal = seanceActive ? seanceActive.prix * nbPlaces : 0

  const dateAujourdhui = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  })

  function formaterDateHeure(dateHeure: string) {
    const d = new Date(dateHeure)
    return {
      date: d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
      heure: d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    }
  }

  async function continuerVersPaiement() {
    if (!seanceSelectionnee) {
      setErreur("Veuillez sélectionner une séance.")
      return
    }
    setErreur("")
    setChargementPaiement(true)
    try {
      const reponse = await apiFetch('/reservations', {
        method: 'POST',
        body: JSON.stringify({ showtimeId: seanceSelectionnee, nbPlaces })
      })
      window.location.href = reponse.checkoutUrl
    } catch (e: any) {
      setErreur(e.message)
      setChargementPaiement(false)
    }
  }

  if (chargement || chargementSeances) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0A0A0A" }}>
        <p style={{ color: "#888888" }}>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ backgroundColor: "#0A0A0A" }}>
      <div className="w-full max-w-lg">
        <div className="rounded-2xl p-8" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>

          <div className="flex gap-4 mb-6">
            {film?.affiche && (
              <img src={film.affiche} alt={film.titre} className="w-16 object-cover rounded-xl flex-shrink-0" style={{ height: "88px" }} />
            )}
            <div>
              <p className="text-xs mb-1" style={{ color: "#888888" }}>Reservation</p>
              <h1 className="text-xl font-bold text-white">{film?.titre}</h1>
              <p className="text-xs mt-1" style={{ color: "#888888" }}>{dateAujourdhui}</p>
            </div>
          </div>

          {erreur && (
            <div className="px-4 py-3 rounded-xl mb-4 text-sm"
              style={{ backgroundColor: "#E2001A10", border: "1px solid #E2001A30", color: "#E2001A" }}>
              {erreur}
            </div>
          )}

          <h2 className="text-lg font-bold text-white mb-4">Choisissez votre séance</h2>

          {seances.length === 0 ? (
            <div className="text-center py-6">
              <p style={{ color: "#888888" }}>Aucune séance disponible pour ce film.</p>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <label className="text-xs block mb-1" style={{ color: "#888888" }}>Séance</label>
                <select value={seanceSelectionnee} onChange={e => setSeanceSelectionnee(e.target.value)}
                  className="w-full text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ backgroundColor: "#0A0A0A", border: "1px solid #222222" }}>
                  {seances.map(function(s) {
                    const { date, heure } = formaterDateHeure(s.dateHeure)
                    return (
                      <option key={s.id} value={s.id}>
                        {date} à {heure}{s.salle?.nom ? ` — ${s.salle.nom}` : ''} — {s.prix?.toLocaleString()} FCFA/place
                      </option>
                    )
                  })}
                </select>
              </div>

              <div className="mb-6">
                <label className="text-xs block mb-1" style={{ color: "#888888" }}>Nombre de places</label>
                <select value={nbPlaces} onChange={e => setNbPlaces(Number(e.target.value))}
                  className="w-full text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ backgroundColor: "#0A0A0A", border: "1px solid #222222" }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>{n} place{n > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>

              <div className="rounded-xl p-4 mb-6 flex items-center justify-between"
                style={{ backgroundColor: "#0A0A0A", border: "1px solid #222222" }}>
                <div>
                  <p className="text-xs" style={{ color: "#888888" }}>{nbPlaces} place{nbPlaces > 1 ? "s" : ""} x {seanceActive?.prix?.toLocaleString() || '—'} FCFA</p>
                  <p className="text-white font-bold text-lg">{montantTotal.toLocaleString()} FCFA</p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "#888888" }}>Paiement via</p>
                  <p className="font-bold" style={{ color: "#00A651" }}>NabooPay</p>
                </div>
              </div>

              <button onClick={continuerVersPaiement} disabled={chargementPaiement}
                className="w-full py-3 rounded-xl font-bold text-lg transition disabled:opacity-50"
                style={{ backgroundColor: "#00A651", color: "#ffffff" }}>
                {chargementPaiement ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin inline-block">⟳</span> Redirection en cours...
                  </span>
                ) : "Continuer vers le paiement"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
