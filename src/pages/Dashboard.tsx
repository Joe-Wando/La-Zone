import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [utilisateur, setUtilisateur] = useState<any>(null)
  const [reservations, setReservations] = useState<any[]>([])
  const [chargement, setChargement] = useState(true)
  const [suppressionId, setSuppressionId] = useState<string | null>(null)

  useEffect(function() {
    const desabonner = auth.onAuthStateChanged(function(user) {
      setUtilisateur(user)
    })
    return desabonner
  }, [])

  useEffect(function() {
    if (!utilisateur) return
    async function chargerReservations() {
      const requete = query(
        collection(db, 'reservations'),
        where('email', '==', utilisateur?.email)
      )
      const resultats = await getDocs(requete)
      const liste = resultats.docs.map(function(doc) {
        return { id: doc.id, ...doc.data() }
      })
      setReservations(liste)
      setChargement(false)
    }
    chargerReservations()
  }, [utilisateur])

  async function supprimerReservation(id: string) {
    try {
      await deleteDoc(doc(db, 'reservations', id))
      setReservations(function(prev) {
        return prev.filter(r => r.id !== id)
      })
      setSuppressionId(null)
    } catch (e) {
      console.error("Erreur suppression", e)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#0A0A0A' }}>

      {/* En-tete */}
      <div className="mb-8">
        <p className="text-sm mb-1" style={{ color: '#888888' }}>Tableau de bord</p>
        <h1 className="text-2xl md:text-4xl font-bold text-white">
          Bonjour {utilisateur?.displayName || utilisateur?.email}
        </h1>
        <p className="mt-2 text-sm" style={{ color: '#888888' }}>
          Voici un resume de votre activite sur LAZONE
        </p>
      </div>

      {/* Cartes stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl p-5 md:p-6"
          style={{ background: 'linear-gradient(135deg, #00A651, #007A3D)' }}>
          <p className="text-white/70 text-sm mb-1">Films reserves</p>
          <p className="text-4xl md:text-5xl font-bold text-white">{reservations.length}</p>
          <p className="text-white/60 text-xs mt-3">Total de vos reservations</p>
        </div>

        <div className="rounded-2xl p-5 md:p-6"
          style={{ background: 'linear-gradient(135deg, #FDEF00, #C8B800)' }}>
          <p className="text-black/70 text-sm mb-1">Derniere reservation</p>
          <p className="text-xl md:text-2xl font-bold text-black mt-2">
            {reservations.length > 0
              ? reservations[reservations.length - 1].date
              : "—"}
          </p>
          <p className="text-black/60 text-xs mt-3">Date de votre derniere seance</p>
        </div>

        <div className="rounded-2xl p-5 md:p-6"
          style={{ background: 'linear-gradient(135deg, #E2001A, #A80013)' }}>
          <p className="text-white/70 text-sm mb-1">Statut</p>
          <p className="text-xl md:text-2xl font-bold text-white mt-2">Membre actif</p>
          <p className="text-white/60 text-xs mt-3">Merci pour votre fidelite</p>
        </div>
      </div>

      {/* Liste reservations */}
      <div className="rounded-2xl p-4 md:p-6"
        style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-white">Mes reservations</h2>
          <Link to="/films"
            className="text-sm px-4 py-2 rounded-lg font-semibold transition text-center"
            style={{ backgroundColor: '#00A651', color: '#ffffff' }}>
            + Reserver un film
          </Link>
        </div>

        {chargement ? (
          <p style={{ color: '#888888' }}>Chargement...</p>
        ) : reservations.length === 0 ? (
          <div className="text-center py-10">
            <p style={{ color: '#888888' }}>Aucune reservation pour le moment.</p>
            <Link to="/films"
              className="text-sm mt-2 inline-block hover:underline"
              style={{ color: '#00A651' }}>
              Voir les films disponibles
            </Link>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#222222' }}>
            {reservations.map(function(reservation) {
              return (
                <div key={reservation.id} className="py-4">

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {reservation.filmAffiche && (
                        <img src={reservation.filmAffiche} alt={reservation.filmTitre}
                          className="w-10 h-14 md:w-12 md:h-16 object-cover rounded-lg flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-semibold text-white text-sm">{reservation.filmTitre}</p>
                        <p className="text-xs mt-1" style={{ color: '#888888' }}>
                          {reservation.dateSeance || reservation.date}
                          {reservation.horaire && ` — ${reservation.horaire}`}
                        </p>
                        {reservation.nbPlaces && (
                          <p className="text-xs mt-0.5" style={{ color: '#888888' }}>
                            {reservation.nbPlaces} place{reservation.nbPlaces > 1 ? 's' : ''}
                          </p>
                        )}
                        {reservation.numeroTicket && (
                          <p className="text-xs font-mono mt-1" style={{ color: '#FDEF00' }}>
                            {reservation.numeroTicket}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap"
                        style={{ backgroundColor: '#00A65115', color: '#00A651', border: '1px solid #00A65130' }}>
                        Confirme
                      </span>

                      {suppressionId === reservation.id ? (
                        <div className="flex gap-2 items-center">
                          <button onClick={() => supprimerReservation(reservation.id)}
                            className="text-xs px-3 py-1 rounded-lg font-semibold"
                            style={{ backgroundColor: '#E2001A20', color: '#E2001A', border: '1px solid #E2001A30' }}>
                            Oui
                          </button>
                          <button onClick={() => setSuppressionId(null)}
                            className="text-xs px-3 py-1 rounded-lg font-semibold"
                            style={{ backgroundColor: '#222222', color: '#888888' }}>
                            Non
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setSuppressionId(reservation.id)}
                          className="text-xs px-3 py-1 rounded-lg transition whitespace-nowrap"
                          style={{ backgroundColor: '#E2001A15', color: '#E2001A', border: '1px solid #E2001A25' }}>
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}