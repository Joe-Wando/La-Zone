import { useEffect, useState } from "react"
import { apiFetch } from "../api"

export interface Film {
  id: string
  tmdbId: number
  titre: string
  affiche: string
  note: number
  synopsis: string
  duree?: number
  genre?: string
}

export function useFilms() {
  const [films, setFilms] = useState<Film[]>([])
  const [chargement, setChargement] = useState(true)

  useEffect(function() {
    async function chargerFilms() {
      try {
        const donnees = await apiFetch('/films')

        const liste: Film[] = donnees.map(function(film: any) {
          return {
            id: film.id,
            tmdbId: film.tmdbId,
            titre: film.titre,
            affiche: film.affiche,
            note: film.note,
            synopsis: film.description,
            duree: film.duree,
            genre: film.genre,
          }
        })

        setFilms(liste)
      } catch (e) {
        console.error("Erreur lors du chargement des films", e)
      } finally {
        setChargement(false)
      }
    }

    chargerFilms()
  }, [])

  return { films, chargement }
}