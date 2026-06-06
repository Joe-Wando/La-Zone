import { useEffect, useState } from "react"

export interface Film {
  id: number
  titre: string
  affiche: string
  note: number
  synopsis: string
}

export function useFilms() {
  const [films, setFilms] = useState<Film[]>([])
  const [chargement, setChargement] = useState(true)

  useEffect(function() {
    async function chargerFilms() {
      try {
        // On charge 5 pages en parallele
        const promesses = [1, 2, 3, 4, 5].map(function(page) {
          return fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=fr-FR&page=${page}`
          ).then(r => r.json())
        })

        const resultats = await Promise.all(promesses)

        const liste: Film[] = resultats.flatMap(function(data) {
          return data.results.map(function(film: any) {
            return {
              id: film.id,
              titre: film.title,
              affiche: "https://image.tmdb.org/t/p/w500" + film.poster_path,
              note: film.vote_average,
              synopsis: film.overview,
            }
          })
        })

        setFilms(liste)
      } catch (e) {
        console.error("Erreur TMDB", e)
      } finally {
        setChargement(false)
      }
    }

    chargerFilms()
  }, [])

  return { films, chargement }
}