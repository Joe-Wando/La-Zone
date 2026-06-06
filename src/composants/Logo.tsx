export function LogoGrand() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-4">
        {/* Grille 3x3 */}
        <div className="grid grid-cols-3 gap-1">
          <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: '#00A651' }}></div>
          <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: '#00A651' }}></div>
          <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: '#FDEF00' }}></div>
          <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: '#00A651' }}></div>
          <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: '#0A0A0A', border: '1px solid #222222' }}></div>
          <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: '#0A0A0A', border: '1px solid #222222' }}></div>
          <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: '#E2001A' }}></div>
          <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: '#E2001A' }}></div>
          <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: '#E2001A' }}></div>
        </div>

        {/* Texte + ligne tricolore */}
        <div>
          <p style={{ fontFamily: 'Arial', fontWeight: 900, fontSize: '36px', letterSpacing: '6px', color: '#ffffff', lineHeight: 1 }}>
            LAZONE
          </p>
          <div className="flex mt-1">
            <div className="h-1 w-12" style={{ backgroundColor: '#00A651' }}></div>
            <div className="h-1 w-12" style={{ backgroundColor: '#FDEF00' }}></div>
            <div className="h-1 w-12" style={{ backgroundColor: '#E2001A' }}></div>
          </div>
        </div>
      </div>

      <p className="mt-2 text-xs tracking-widest" style={{ color: '#888888', letterSpacing: '4px' }}>
        PLATEFORME DE RESERVATION CINEMA
      </p>
    </div>
  )
}

export function LogoPetit() {
  return (
    <div className="flex items-center gap-3">
      {/* Grille 3x3 */}
      <div className="grid grid-cols-3 gap-0.5">
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#00A651' }}></div>
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#00A651' }}></div>
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#FDEF00' }}></div>
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#00A651' }}></div>
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#0A0A0A', border: '1px solid #222222' }}></div>
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#0A0A0A', border: '1px solid #222222' }}></div>
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#E2001A' }}></div>
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#E2001A' }}></div>
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#E2001A' }}></div>
      </div>

      {/* Texte + ligne tricolore */}
      <div>
        <p style={{ fontFamily: 'Arial', fontWeight: 900, fontSize: '18px', letterSpacing: '4px', color: '#ffffff', lineHeight: 1 }}>
          LAZONE
        </p>
        <div className="flex mt-0.5">
          <div className="h-0.5 w-6" style={{ backgroundColor: '#00A651' }}></div>
          <div className="h-0.5 w-6" style={{ backgroundColor: '#FDEF00' }}></div>
          <div className="h-0.5 w-6" style={{ backgroundColor: '#E2001A' }}></div>
        </div>
      </div>
    </div>
  )
}