import { Link } from 'react-router-dom'
import { LogoPetit } from './Logo'

export default function Footer() {
  return (
    <footer className="py-10 px-8"
      style={{ borderTop: '1px solid #222222', backgroundColor: '#0A0A0A' }}>
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">

          <div>
            <div className="mb-4">
              <LogoPetit />
            </div>
            <p className="text-sm" style={{ color: '#888888' }}>
              La billetterie cinema du Senegal. Reservez vos places en ligne en quelques clics.
            </p>
          </div>

          <div>
            <p className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Navigation</p>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm hover:text-white transition" style={{ color: '#888888' }}>Accueil</Link>
              <Link to="/films" className="text-sm hover:text-white transition" style={{ color: '#888888' }}>Films</Link>
              <Link to="/dashboard" className="text-sm hover:text-white transition" style={{ color: '#888888' }}>Mon espace</Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Service client</p>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#888888' }}>Telephone</p>
                <a href="tel:+221785268208"
                  className="text-sm font-semibold hover:underline transition"
                  style={{ color: '#00A651' }}>
                  +221 78 526 82 08
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#888888' }}>Email</p>
                <a href="mailto:jonathan6wando@gmail.com"
                  className="text-sm font-semibold hover:underline transition"
                  style={{ color: '#00A651' }}>
                  jonathan6wando@gmail.com
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#888888' }}>Horaires</p>
                <p className="text-sm" style={{ color: '#888888' }}>Lun - Sam : 9h00 - 20h00</p>
              </div>
            </div>
          </div>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid #222222' }}>
          <p className="text-xs" style={{ color: '#222222' }}>
            2026 LAZONE. Tous droits reserves.
          </p>
          <p className="text-xs" style={{ color: '#222222' }}>
            Pour annuler une reservation, contactez notre service client.
          </p>
        </div>

      </div>
    </footer>
  )
}