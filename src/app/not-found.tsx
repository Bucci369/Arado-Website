import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-8">Seite nicht gefunden</h2>
        <p className="text-gray-400 mb-8">
          Die angeforderte Seite existiert nicht.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-white text-black px-6 py-3 rounded-md hover:bg-gray-200 transition-colors"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  )
}
