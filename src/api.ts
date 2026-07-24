const API_URL = "http://localhost:3000";

function getToken(): string | null {
  return localStorage.getItem("token");
}

export async function apiFetch(chemin: string, options: RequestInit = {}) {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const reponse = await fetch(`${API_URL}${chemin}`, { ...options, headers });

  if (reponse.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    throw new Error("Session expirée, veuillez vous reconnecter");
  }

  if (!reponse.ok) {
    const erreur = await reponse.json().catch(() => ({}));
    const message = Array.isArray(erreur.message)
      ? erreur.message.join(", ")
      : erreur.message || "Une erreur est survenue";
    throw new Error(message);
  }

  if (reponse.status === 204) return null;

  return reponse.json();
}