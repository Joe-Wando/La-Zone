import { useParams, useNavigate } from "react-router-dom"
import { useFilms } from "../hooks/useFilms"
import { useState, useEffect, useRef } from "react"
import { apiFetch } from "../api"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

function genererCodeConfirmation() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export default function Reservation() {
  const { id } = useParams()
  const naviguer = useNavigate()
  const { films, chargement } = useFilms()
  const ticketRef = useRef<HTMLDivElement>(null)

  const film = films.find(f => f.id === id)

  const utilisateur = JSON.parse(localStorage.getItem('user') || '{}')

  const [seances, setSeances] = useState<any[]>([])
  const [seanceSelectionnee, setSeanceSelectionnee] = useState<string>("")
  const [chargementSeances, setChargementSeances] = useState(true)
  const [reservationConfirmee, setReservationConfirmee] = useState<any>(null)

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

  // Etapes : formulaire → paiement → confirmation → billet
  const [etape, setEtape] = useState<"formulaire" | "paiement" | "verification" | "billet">("formulaire")

  const [nbPlaces, setNbPlaces] = useState(1)
  const [erreur, setErreur] = useState("")

  // Paiement Wave
  const [telephone, setTelephone] = useState("")
  const [chargementPaiement, setChargementPaiement] = useState(false)
  const [codeAttendu, setCodeAttendu] = useState("")
  const [codeSaisi, setCodeSaisi] = useState("")

  const [telechargement, setTelechargement] = useState(false)

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

  // ETAPE 1 — Valider le formulaire
  function validerFormulaire() {
    if (!seanceSelectionnee) {
      setErreur("Veuillez sélectionner une séance.")
      return
    }
    setErreur("")
    setEtape("paiement")
  }

  // ETAPE 2 — Simuler le paiement Wave
  async function simulerPaiement() {
    if (telephone.length < 9) {
      setErreur("Veuillez entrer un numéro valide.")
      return
    }
    setErreur("")
    setChargementPaiement(true)

    await new Promise(resolve => setTimeout(resolve, 2500))

    const code = genererCodeConfirmation()
    setCodeAttendu(code)
    setChargementPaiement(false)
    setEtape("verification")
  }

  // ETAPE 3 — Vérifier le code et confirmer
  async function confirmerPaiement() {
    if (codeSaisi !== codeAttendu) {
      setErreur("Code incorrect. Veuillez réessayer.")
      return
    }
    setErreur("")
    setChargementPaiement(true)

    try {
      const reservation = await apiFetch('/reservations', {
        method: 'POST',
        body: JSON.stringify({ showtimeId: seanceSelectionnee, nbPlaces })
      })
      setReservationConfirmee(reservation)
      setEtape("billet")
    } catch (e: any) {
      setErreur(e.message)
    } finally {
      setChargementPaiement(false)
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
      const numeroTicket = reservationConfirmee?.tickets?.[0]?.numeroTicket || 'reservation'
      pdf.save(`billet-${numeroTicket}.pdf`)
    } catch (e) {
      console.error("Erreur telechargement", e)
    } finally {
      setTelechargement(false)
    }
  }

  if (chargement || chargementSeances) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0A0A0A" }}>
        <p style={{ color: "#888888" }}>Chargement...</p>
      </div>
    )
  }

  if (etape === "billet" && reservationConfirmee) {
    const { date, heure } = formaterDateHeure(reservationConfirmee.showtime?.dateHeure)
    const premierTicket = reservationConfirmee.tickets?.[0]

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ backgroundColor: "#0A0A0A" }}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Paiement confirme !</h2>
          <p className="mt-2" style={{ color: "#888888" }}>Votre billet a ete envoye a {utilisateur.email}</p>
        </div>

        {/* Billet */}
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
                  <p className="text-white font-semibold text-sm">{reservationConfirmee.nbPlaces} place{reservationConfirmee.nbPlaces > 1 ? "s" : ""}</p>
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
                  <p className="font-semibold text-sm" style={{ color: "#00A651" }}>{reservationConfirmee.prixTotal?.toLocaleString()} FCFA</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#888888" }}>Paiement</p>
                  <p className="font-semibold text-sm" style={{ color: "#00A651" }}>Wave</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#888888" }}>N° Billet</p>
              <p className="font-mono font-bold" style={{ color: "#00A651" }}>{premierTicket?.numeroTicket}</p>
              {reservationConfirmee.tickets?.length > 1 && (
                <p className="text-xs mt-1" style={{ color: "#888888" }}>
                  +{reservationConfirmee.tickets.length - 1} autre{reservationConfirmee.tickets.length > 2 ? "s" : ""} billet{reservationConfirmee.tickets.length > 2 ? "s" : ""}
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

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ backgroundColor: "#0A0A0A" }}>
      <div className="w-full max-w-lg">

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {["formulaire", "paiement", "verification"].map(function(e, i) {
            const actif = etape === e
            const fait = ["formulaire", "paiement", "verification"].indexOf(etape) > i
            return (
              <div key={e} className="flex items-center gap-2 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
                  style={{
                    backgroundColor: fait ? "#00A651" : actif ? "#00A651" : "#222222",
                    color: "#ffffff"
                  }}>
                  {fait ? "✓" : i + 1}
                </div>
                <p className="text-xs hidden md:block" style={{ color: actif ? "#00A651" : "#888888" }}>
                  {e === "formulaire" ? "Infos" : e === "paiement" ? "Paiement" : "Confirmation"}
                </p>
                {i < 2 && <div className="flex-1 h-0.5" style={{ backgroundColor: fait ? "#00A651" : "#222222" }}></div>}
              </div>
            )
          })}
        </div>

        <div className="rounded-2xl p-8" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>

          {/* Affiche + titre */}
          <div className="flex gap-4 mb-6">
            {film?.affiche && (
              <img src={film.affiche} alt={film.titre} className="w-16 h-22 object-cover rounded-xl flex-shrink-0" style={{ height: "88px" }} />
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

          {etape === "formulaire" && (
            <div>
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

                  {/* Recapitulatif montant */}
                  <div className="rounded-xl p-4 mb-6 flex items-center justify-between"
                    style={{ backgroundColor: "#0A0A0A", border: "1px solid #222222" }}>
                    <div>
                      <p className="text-xs" style={{ color: "#888888" }}>{nbPlaces} place{nbPlaces > 1 ? "s" : ""} x {seanceActive?.prix?.toLocaleString() || '—'} FCFA</p>
                      <p className="text-white font-bold text-lg">{montantTotal.toLocaleString()} FCFA</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs" style={{ color: "#888888" }}>Paiement via</p>
                      <p className="font-bold" style={{ color: "#00A651" }}>Wave</p>
                    </div>
                  </div>

                  <button onClick={validerFormulaire}
                    className="w-full py-3 rounded-xl font-bold text-lg transition"
                    style={{ backgroundColor: "#00A651", color: "#ffffff" }}>
                    Continuer vers le paiement
                  </button>
                </>
              )}
            </div>
          )}

          {/* PAIEMENT WAVE */}
          {etape === "paiement" && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: "#00A65120", border: "2px solid #00A651" }}>
                  <p className="text-2xl font-black" style={{ color: "#00A651" }}>W</p>
                </div>
                <h2 className="text-lg font-bold text-white">Paiement Wave</h2>
                <p className="text-sm mt-1" style={{ color: "#888888" }}>Entrez votre numéro Wave pour payer</p>
              </div>

              {/* Montant */}
              <div className="rounded-xl p-4 mb-6 text-center"
                style={{ backgroundColor: "#0A0A0A", border: "1px solid #00A651" }}>
                <p className="text-xs mb-1" style={{ color: "#888888" }}>Montant à payer</p>
                <p className="text-3xl font-black" style={{ color: "#00A651" }}>{montantTotal.toLocaleString()} FCFA</p>
                <p className="text-xs mt-1" style={{ color: "#888888" }}>{film?.titre} — {nbPlaces} place{nbPlaces > 1 ? "s" : ""}</p>
              </div>

              <div className="mb-6">
                <label className="text-xs block mb-1" style={{ color: "#888888" }}>Numéro de téléphone Wave</label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 rounded-xl" style={{ backgroundColor: "#0A0A0A", border: "1px solid #222222" }}>
                    <p className="text-white text-sm font-bold">+221</p>
                  </div>
                  <input type="tel" placeholder="77 000 00 00" value={telephone}
                    onChange={e => setTelephone(e.target.value)}
                    className="flex-1 text-white px-3 py-3 rounded-xl text-sm focus:outline-none"
                    style={{ backgroundColor: "#0A0A0A", border: "1px solid #222222" }} />
                </div>
              </div>

              <button onClick={simulerPaiement} disabled={chargementPaiement}
                className="w-full py-3 rounded-xl font-bold text-lg transition disabled:opacity-50 mb-3"
                style={{ backgroundColor: "#00A651", color: "#ffffff" }}>
                {chargementPaiement ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⟳</span> Traitement en cours...
                  </span>
                ) : `Payer ${montantTotal.toLocaleString()} FCFA`}
              </button>

              <button onClick={() => setEtape("formulaire")}
                className="w-full py-2 text-sm transition"
                style={{ color: "#888888" }}>
                Retour
              </button>
            </div>
          )}

          {/* ETAPE 3 — CODE DE CONFIRMATION */}
          {etape === "verification" && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: "#00A65120", border: "2px solid #00A651" }}>
                  <p className="text-2xl">📱</p>
                </div>
                <h2 className="text-lg font-bold text-white">Code de confirmation</h2>
                <p className="text-sm mt-1" style={{ color: "#888888" }}>
                  Un code a ete envoye au +221 {telephone}
                </p>
              </div>

              {/* Affichage du code pour la demo */}
              <div className="rounded-xl p-4 mb-6 text-center"
                style={{ backgroundColor: "#00A65110", border: "1px solid #00A65130" }}>
                <p className="text-xs mb-1" style={{ color: "#888888" }}>Code de confirmation (demo)</p>
                <p className="text-3xl font-black tracking-widest" style={{ color: "#00A651" }}>{codeAttendu}</p>
              </div>

              <div className="mb-6">
                <label className="text-xs block mb-1" style={{ color: "#888888" }}>Entrez le code recu</label>
                <input type="text" placeholder="XXXX" maxLength={4} value={codeSaisi}
                  onChange={e => setCodeSaisi(e.target.value)}
                  className="w-full text-white px-3 py-3 rounded-xl text-xl text-center font-bold tracking-widest focus:outline-none"
                  style={{ backgroundColor: "#0A0A0A", border: "1px solid #222222" }} />
              </div>

              <button onClick={confirmerPaiement} disabled={chargementPaiement}
                className="w-full py-3 rounded-xl font-bold text-lg transition disabled:opacity-50 mb-3"
                style={{ backgroundColor: "#00A651", color: "#ffffff" }}>
                {chargementPaiement ? "Confirmation..." : "Confirmer le paiement"}
              </button>

              <button onClick={() => setEtape("paiement")}
                className="w-full py-2 text-sm transition"
                style={{ color: "#888888" }}>
                Retour
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
