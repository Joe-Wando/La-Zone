import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import emailjs from "@emailjs/browser"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, CartesianGrid
} from 'recharts'

const ADMINS = ["jonathan6wando@gmail.com", "ba2002coumba@gmail.com"]

export default function Admin() {
  const [utilisateur, setUtilisateur] = useState<any>(null)
  const [reservations, setReservations] = useState<any[]>([])
  const [chargement, setChargement] = useState(true)
  const [pageCourante, setPageCourante] = useState('overview')
  const [recherche, setRecherche] = useState("")
  const [suppressionId, setSuppressionId] = useState<string | null>(null)
  const [suppressionChargement, setSuppressionChargement] = useState(false)
  const [sidebarOuverte, setSidebarOuverte] = useState(false)
  const navigate = useNavigate()

useEffect(function() {
  const desabonner = auth.onAuthStateChanged(function(user) {
    if (!user) { 
      navigate('/connexion')
      return 
    }
    if (!ADMINS.includes(user.email || "")) { 
      navigate('/dashboard')
      return 
    }
    setUtilisateur(user)
  })
  
  return desabonner
}, [])


  useEffect(function() {
    if (!utilisateur) return
    async function chargerToutesReservations() {
      const resultats = await getDocs(collection(db, 'reservations'))
      const liste = resultats.docs.map(function(doc) {
        return { id: doc.id, ...doc.data() }
      })
      setReservations(liste)
      setChargement(false)
    }
    chargerToutesReservations()
  }, [utilisateur])

  async function deconnecter() {
    await signOut(auth)
    navigate('/')
  }

  async function supprimerReservation(reservation: any) {
    setSuppressionChargement(true)
    try {
      await deleteDoc(doc(db, 'reservations', reservation.id))
      await emailjs.send(
        "service_4zcakd1",
        "template_hvr9y44",
        {
          nom: reservation.nom,
          prenom: reservation.prenom,
          email: reservation.email,
          film_titre: reservation.filmTitre,
          date_seance: reservation.dateSeance || reservation.date,
          numero_ticket: reservation.numeroTicket || '—',
          message: "Votre reservation a ete annulee par notre service client."
        },
        "LXcpyZm3pWLch4zM0"
      )
      setReservations(function(prev) {
        return prev.filter(r => r.id !== reservation.id)
      })
      setSuppressionId(null)
    } catch (e) {
      console.error("Erreur suppression", e)
    } finally {
      setSuppressionChargement(false)
    }
  }

  const reservationsFiltrees = reservations.filter(function(r) {
    return (
      r.filmTitre?.toLowerCase().includes(recherche.toLowerCase()) ||
      r.email?.toLowerCase().includes(recherche.toLowerCase()) ||
      r.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
      r.prenom?.toLowerCase().includes(recherche.toLowerCase())
    )
  })

  const totalPlaces = reservations.reduce((acc, r) => acc + (r.nbPlaces || 1), 0)

  const donneesHoraires = [
    { horaire: '14h00', reservations: reservations.filter(r => r.horaire === '14h00').length },
    { horaire: '19h00', reservations: reservations.filter(r => r.horaire === '19h00').length },
    { horaire: '22h00', reservations: reservations.filter(r => r.horaire === '22h00').length },
  ]

  const filmsCount: Record<string, number> = {}
  reservations.forEach(function(r) {
    if (r.filmTitre) filmsCount[r.filmTitre] = (filmsCount[r.filmTitre] || 0) + 1
  })
  const topFilms = Object.entries(filmsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([titre, count]) => ({ titre: titre.slice(0, 15) + (titre.length > 15 ? '...' : ''), count }))

  const parDate: Record<string, number> = {}
  reservations.forEach(function(r) {
    const date = r.dateSeance || r.date || 'Inconnue'
    parDate[date] = (parDate[date] || 0) + 1
  })
  const donneesDate = Object.entries(parDate)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-7)
    .map(([date, count]) => ({ date, count }))

  const donneesParts = [
    { name: '1 place', value: reservations.filter(r => (r.nbPlaces || 1) === 1).length },
    { name: '2 places', value: reservations.filter(r => r.nbPlaces === 2).length },
    { name: '3+ places', value: reservations.filter(r => (r.nbPlaces || 1) >= 3).length },
  ]
  const COULEURS = ['#00A651', '#FDEF00', '#E2001A']

  const navItems = [
    { id: 'overview', label: "Vue d'ensemble" },
    { id: 'reservations', label: "Toutes les reservations" },
    { id: 'utilisateurs', label: "Utilisateurs" },
  ]

  function SidebarContenu() {
    return (
      <>
        <p className="text-xl font-extrabold mb-1 px-4" style={{ color: '#00A651' }}>LAZONE</p>
        <p className="text-xs px-4 mb-10" style={{ color: '#888888' }}>Panel Admin</p>

        <p className="text-xs font-semibold px-4 mb-3 uppercase tracking-wider"
          style={{ color: '#888888' }}>Tableau de bord</p>

        {navItems.map(function(item) {
          const actif = pageCourante === item.id
          return (
            <button key={item.id}
              onClick={() => { setPageCourante(item.id); setSidebarOuverte(false) }}
              className="text-left px-4 py-3 rounded-xl mb-1 text-sm font-medium transition w-full"
              style={{
                backgroundColor: actif ? '#00A65115' : 'transparent',
                color: actif ? '#00A651' : '#888888',
                border: actif ? '1px solid #00A65130' : '1px solid transparent'
              }}>
              {item.label}
            </button>
          )
        })}

        <div className="mt-auto px-4">
          <div className="rounded-xl p-4 mb-4"
            style={{ backgroundColor: '#00A65110', border: '1px solid #00A65120' }}>
            <p className="text-xs font-semibold text-white truncate">{utilisateur?.email}</p>
            <p className="text-xs mt-1" style={{ color: '#00A651' }}>Administrateur</p>
          </div>
          <button onClick={deconnecter}
            className="w-full py-2 rounded-xl text-sm font-semibold transition"
            style={{ backgroundColor: '#222222', color: '#888888' }}>
            Deconnexion
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>

      {/* Sidebar desktop */}
      <div className="hidden md:flex w-64 flex-col py-8 px-4"
        style={{ backgroundColor: '#111111', borderRight: '1px solid #222222' }}>
        <SidebarContenu />
      </div>

      {/* Sidebar mobile — overlay */}
      {sidebarOuverte && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Fond semi-transparent */}
          <div className="absolute inset-0 bg-black/70"
            onClick={() => setSidebarOuverte(false)}></div>
          {/* Menu */}
          <div className="absolute left-0 top-0 bottom-0 w-64 flex flex-col py-8 px-4"
            style={{ backgroundColor: '#111111' }}>
            <SidebarContenu />
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">

        {/* Header mobile avec bouton menu */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm" style={{ color: '#888888' }}>Administration</p>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Panel Admin</h1>
          </div>
          {/* Bouton hamburger mobile */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg"
            style={{ backgroundColor: '#111111', border: '1px solid #222222' }}
            onClick={() => setSidebarOuverte(true)}>
            <div className="w-5 h-0.5" style={{ backgroundColor: '#ffffff' }}></div>
            <div className="w-5 h-0.5" style={{ backgroundColor: '#ffffff' }}></div>
            <div className="w-5 h-0.5" style={{ backgroundColor: '#ffffff' }}></div>
          </button>
        </div>

        {/* VUE D'ENSEMBLE */}
        {pageCourante === 'overview' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total reservations', value: reservations.length, color: '#00A651' },
                { label: 'Places vendues', value: totalPlaces, color: '#FDEF00' },
                { label: 'Clients uniques', value: [...new Set(reservations.map(r => r.email))].length, color: '#00A651' },
                { label: 'Films reserves', value: [...new Set(reservations.map(r => r.filmTitre))].length, color: '#FDEF00' },
              ].map(function(carte) {
                return (
                  <div key={carte.label} className="rounded-2xl p-4 md:p-5"
                    style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
                    <p className="text-xs mb-2" style={{ color: '#888888' }}>{carte.label}</p>
                    <p className="text-3xl md:text-4xl font-bold" style={{ color: carte.color }}>{carte.value}</p>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-2xl p-6"
                style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
                <h2 className="text-sm font-bold text-white mb-6">Reservations par horaire</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={donneesHoraires}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                    <XAxis dataKey="horaire" stroke="#888888" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#888888" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#111111', border: '1px solid #222222', borderRadius: 8 }}
                      labelStyle={{ color: '#ffffff' }} itemStyle={{ color: '#00A651' }} />
                    <Bar dataKey="reservations" fill="#00A651" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl p-6"
                style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
                <h2 className="text-sm font-bold text-white mb-6">Top 5 films</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={topFilms} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                    <XAxis type="number" stroke="#888888" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="titre" type="category" stroke="#888888" tick={{ fontSize: 11 }} width={100} />
                    <Tooltip contentStyle={{ backgroundColor: '#111111', border: '1px solid #222222', borderRadius: 8 }}
                      labelStyle={{ color: '#ffffff' }} itemStyle={{ color: '#FDEF00' }} />
                    <Bar dataKey="count" fill="#FDEF00" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-2xl p-6"
                style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
                <h2 className="text-sm font-bold text-white mb-6">Reservations par date</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={donneesDate}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                    <XAxis dataKey="date" stroke="#888888" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#888888" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#111111', border: '1px solid #222222', borderRadius: 8 }}
                      labelStyle={{ color: '#ffffff' }} itemStyle={{ color: '#00A651' }} />
                    <Line type="monotone" dataKey="count" stroke="#00A651"
                      strokeWidth={2} dot={{ fill: '#00A651', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl p-6"
                style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
                <h2 className="text-sm font-bold text-white mb-6">Repartition des places</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={donneesParts} cx="50%" cy="50%" innerRadius={50}
                      outerRadius={80} dataKey="value" paddingAngle={3}>
                      {donneesParts.map(function(_, index) {
                        return <Cell key={index} fill={COULEURS[index % COULEURS.length]} />
                      })}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111111', border: '1px solid #222222', borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex gap-4 justify-center mt-2">
                  {donneesParts.map(function(d, i) {
                    return (
                      <div key={d.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COULEURS[i] }}></div>
                        <span className="text-xs" style={{ color: '#888888' }}>{d.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6"
              style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
              <h2 className="text-sm font-bold text-white mb-6">Dernieres reservations</h2>
              <div className="divide-y" style={{ borderColor: '#222222' }}>
                {reservations.slice(-5).reverse().map(function(r) {
                  return (
                    <div key={r.id} className="flex items-center justify-between py-4">
                      <div>
                        <p className="font-semibold text-white text-sm">{r.filmTitre}</p>
                        <p className="text-xs" style={{ color: '#888888' }}>
                          {r.prenom} {r.nom} — {r.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono" style={{ color: '#FDEF00' }}>
                          {r.numeroTicket || '—'}
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#888888' }}>
                          {r.nbPlaces || 1} place{(r.nbPlaces || 1) > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* TOUTES LES RESERVATIONS */}
        {pageCourante === 'reservations' && (
          <div className="rounded-2xl p-4 md:p-6"
            style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-white">
                Toutes les reservations ({reservations.length})
              </h2>
              <input type="text" placeholder="Rechercher..."
                value={recherche} onChange={e => setRecherche(e.target.value)}
                className="text-white px-4 py-2 rounded-xl text-sm focus:outline-none w-full md:w-48"
                style={{ backgroundColor: '#0A0A0A', border: '1px solid #222222' }} />
            </div>

            {chargement ? (
              <p style={{ color: '#888888' }}>Chargement...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #222222' }}>
                      {['Client', 'Email', 'Film', 'Date', 'Horaire', 'Places', 'N° Ticket', 'Action'].map(h => (
                        <th key={h} className="text-left py-3 px-4 whitespace-nowrap" style={{ color: '#888888' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reservationsFiltrees.map(function(r) {
                      return (
                        <tr key={r.id} style={{ borderBottom: '1px solid #222222' }}>
                          <td className="py-4 px-4 text-white font-semibold whitespace-nowrap">{r.prenom} {r.nom}</td>
                          <td className="py-4 px-4 whitespace-nowrap" style={{ color: '#888888' }}>{r.email}</td>
                          <td className="py-4 px-4 text-white whitespace-nowrap">{r.filmTitre}</td>
                          <td className="py-4 px-4 whitespace-nowrap" style={{ color: '#888888' }}>{r.dateSeance || r.date}</td>
                          <td className="py-4 px-4 whitespace-nowrap" style={{ color: '#888888' }}>{r.horaire || '—'}</td>
                          <td className="py-4 px-4 whitespace-nowrap" style={{ color: '#00A651' }}>{r.nbPlaces || 1}</td>
                          <td className="py-4 px-4 font-mono text-xs whitespace-nowrap" style={{ color: '#FDEF00' }}>{r.numeroTicket || '—'}</td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            {suppressionId === r.id ? (
                              <div className="flex gap-2 items-center">
                                <p className="text-xs" style={{ color: '#888888' }}>Confirmer ?</p>
                                <button
                                  onClick={() => supprimerReservation(r)}
                                  disabled={suppressionChargement}
                                  className="text-xs px-3 py-1 rounded-lg font-semibold disabled:opacity-50"
                                  style={{ backgroundColor: '#E2001A20', color: '#E2001A', border: '1px solid #E2001A30' }}>
                                  {suppressionChargement ? "..." : "Oui"}
                                </button>
                                <button
                                  onClick={() => setSuppressionId(null)}
                                  className="text-xs px-3 py-1 rounded-lg"
                                  style={{ backgroundColor: '#222222', color: '#888888' }}>
                                  Non
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setSuppressionId(r.id)}
                                className="text-xs px-3 py-1 rounded-lg transition whitespace-nowrap"
                                style={{ backgroundColor: '#E2001A15', color: '#E2001A', border: '1px solid #E2001A25' }}>
                                Annuler
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* UTILISATEURS */}
        {pageCourante === 'utilisateurs' && (
          <div className="rounded-2xl p-4 md:p-6"
            style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
            <h2 className="text-xl font-bold text-white mb-6">Utilisateurs actifs</h2>
            <div className="divide-y" style={{ borderColor: '#222222' }}>
              {[...new Set(reservations.map(r => r.email))].map(function(email) {
                const resUser = reservations.filter(r => r.email === email)
                const derniere = resUser[resUser.length - 1]
                return (
                  <div key={email as string} className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {derniere.prenom} {derniere.nom}
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#888888' }}>{email as string}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: '#00A651' }}>
                        {resUser.length} reservation{resUser.length > 1 ? 's' : ''}
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#888888' }}>
                        {resUser.reduce((acc, r) => acc + (r.nbPlaces || 1), 0)} places
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}