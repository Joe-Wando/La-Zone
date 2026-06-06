import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFilms } from "../hooks/useFilms"

export default function Films() {
  const naviguer = useNavigate()
  const { films, chargement } = useFilms()
  const [recherche, setRecherche] = useState("")

  const filmsFiltres = films.filter(function(film) {
    return film.titre.toLowerCase().includes(recherche.toLowerCase())
  })

  return (
    <div className="min-h-screen text-white px-6 py-12"
      style={{ backgroundColor: '#0A0A0A' }}>

      <div className="max-w-6xl mx-auto mb-10">
        <p className="text-sm mb-1" style={{ color: '#888888' }}>Catalogue complet</p>
        <h1 className="text-4xl font-bold mb-6">Nos films</h1>

        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Rechercher un film..."
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
            className="w-full text-white pl-4 pr-4 py-3 rounded-xl focus:outline-none transition"
            style={{ backgroundColor: '#111111', border: '1px solid #222222' }}
          />
          {recherche && (
            <button onClick={() => setRecherche("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 transition hover:text-white"
              style={{ color: '#888888' }}>
              X
            </button>
          )}
        </div>

        <p className="text-sm mt-4" style={{ color: '#888888' }}>
          {filmsFiltres.length} film{filmsFiltres.length > 1 ? "s" : ""} trouve{filmsFiltres.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {chargement ? (
          <div className="flex items-center justify-center py-20">
            <p style={{ color: '#888888' }}>Chargement des films...</p>
          </div>
        ) : filmsFiltres.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg" style={{ color: '#888888' }}>
              Aucun film trouve pour "{recherche}"
            </p>
            <button onClick={() => setRecherche("")}
              className="text-sm mt-3 inline-block hover:underline"
              style={{ color: '#00A651' }}>
              Effacer la recherche
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filmsFiltres.map(function(film) {
              return (
                <div key={film.id}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition duration-300"
                  style={{ border: '1px solid #222222' }}>

                  <img src={film.affiche} alt={film.titre}
                    className="w-full h-72 object-cover" />

                  <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-bold"
                    style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: '#FDEF00' }}>
                    {film.note.toFixed(1)}
                  </span>

                  <div className="absolute bottom-0 left-0 right-0 p-4"
                    style={{ background: 'linear-gradient(to top, black, transparent)' }}>
                    <p className="font-bold text-white text-sm leading-tight">{film.titre}</p>
                  </div>

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col items-center justify-center gap-3 p-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
                    <p className="text-white text-xs text-center line-clamp-4">{film.synopsis}</p>
                    <button
                      onClick={() => naviguer("/reservation/" + film.id)}
                      className="px-6 py-2 rounded-full font-semibold text-sm transition"
                      style={{ backgroundColor: '#00A651', color: '#ffffff' }}>
                      Reserver
                    </button>
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