import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useFilms } from "../hooks/useFilms"
export default function Acceuil() {
  const { films, chargement } = useFilms()
  const [filmHero, setFilmHero] = useState<any>(null)

  useEffect(function() {
    if (films.length > 0) {
      setFilmHero(films[0])
    }
  }, [films])

  return (
    <div style={{ backgroundColor: "#0A0A0A" }} className="text-white min-h-screen">

      {/* HERO */}
      {filmHero && (
        <div className="relative h-screen">
          <img
            src={filmHero.affiche}
            alt={filmHero.titre}
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to right, #0A0A0A 30%, rgba(10,10,10,0.7) 60%, transparent)" }}>
          </div>

          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to top, #0A0A0A 10%, transparent 50%)" }}>
          </div>

          <div className="relative z-10 flex flex-col justify-end pb-32 px-12 h-full max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#00A651" }}>
              Film a l'affiche
            </span>

            <h1 className="text-6xl font-extrabold leading-tight mb-4">
              {filmHero.titre}
            </h1>

            <p className="text-base leading-relaxed mb-8 line-clamp-3"
              style={{ color: "#888888" }}>
              {filmHero.synopsis}
            </p>

            <div className="flex gap-4">
              <Link to={`/reservation/${filmHero.id}`}
                className="px-8 py-3 rounded font-bold text-sm transition"
                style={{ backgroundColor: "#00A651", color: "#ffffff" }}>
                Reserver maintenant
              </Link>

              <Link to="/films"
                className="px-8 py-3 rounded font-bold text-sm transition border"
                style={{ borderColor: "#00A651", color: "#00A651" }}>
                Voir tous les films
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* FILMS POPULAIRES */}
      <section className="px-8 py-12 -mt-16 relative z-10">
        <h2 className="text-xl font-bold mb-6">Films populaires</h2>

        {chargement ? (
          <div className="flex gap-4">
            {Array.from({ length: 6 }).map(function(_, i) {
              return (
                <div key={i}
                  className="rounded-lg w-40 h-60 animate-pulse flex-shrink-0"
                  style={{ backgroundColor: "#111111" }}>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {films.slice(0, 20).map(function(film) {
              return (
                <div key={film.id}
                  className="group relative flex-shrink-0 w-40 cursor-pointer">
                  <img
                    src={film.affiche}
                    alt={film.titre}
                    className="w-full h-60 object-cover rounded-lg group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 rounded-lg transition duration-300 flex items-center justify-center">
                    <Link to={`/reservation/${film.id}`}
                      className="opacity-0 group-hover:opacity-100 text-xs font-bold px-4 py-2 rounded transition duration-300"
                      style={{ backgroundColor: "#00A651", color: "#ffffff" }}>
                      Reserver
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* LES MIEUX NOTES */}
      <section className="px-8 py-12">
        <h2 className="text-xl font-bold mb-6">Les mieux notes</h2>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {films.slice().sort((a, b) => b.note - a.note).slice(0, 20).map(function(film) {
            return (
              <div key={film.id}
                className="group relative flex-shrink-0 w-40 cursor-pointer">
                <img
                  src={film.affiche}
                  alt={film.titre}
                  className="w-full h-60 object-cover rounded-lg group-hover:scale-105 transition duration-300"
                />

                <div className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded"
                  style={{ backgroundColor: "#FDEF00", color: "#0A0A0A" }}>
                  {film.note.toFixed(1)}
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 rounded-lg transition duration-300 flex items-center justify-center">
                  <Link to={`/reservation/${film.id}`}
                    className="opacity-0 group-hover:opacity-100 text-xs font-bold px-4 py-2 rounded transition duration-300"
                    style={{ backgroundColor: "#00A651", color: "#ffffff" }}>
                    Reserver
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* POURQUOI LAZONE */}
      <section className="px-8 py-20" style={{ backgroundColor: "#111111" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-4">
            Pourquoi choisir{" "}
            <span style={{ color: "#00A651" }}>LAZONE</span> ?
          </h2>

          <p className="text-center mb-16" style={{ color: "#888888" }}>
            La meilleure experience de reservation de cinema au Senegal
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl p-8"
              style={{ border: "1px solid #222222" }}>
              <p className="font-bold text-lg mb-3" style={{ color: "#00A651" }}>
                100+ Films
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#888888" }}>
                Un catalogue riche entre films africains, blockbusters et animes.
              </p>
            </div>

            <div className="rounded-2xl p-8"
              style={{ border: "1px solid #222222" }}>
              <p className="font-bold text-lg mb-3" style={{ color: "#FDEF00" }}>
                Reservation rapide
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#888888" }}>
                Reservez votre place en moins de 5 minutes depuis n'importe quel appareil.
              </p>
            </div>

            <div className="rounded-2xl p-8"
              style={{ border: "1px solid #222222" }}>
              <p className="font-bold text-lg mb-3" style={{ color: "#E2001A" }}>
                Confirmation email
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#888888" }}>
                Recevez votre billet instantanement par email apres chaque reservation.
              </p>
            </div>
          </div>
        </div>
      </section>




    </div>
  )
}