export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">CSS is Working!</h1>
        <p className="text-gray-600 mb-6">If you can see this styled content, Tailwind CSS is properly configured.</p>
        <div className="space-y-2">
          <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition">
            Primary Button
          </button>
          <button className="w-full bg-gray-200 text-gray-900 font-semibold py-3 rounded-lg hover:bg-gray-300 transition">
            Secondary Button
          </button>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
          <div className="bg-red-100 text-red-700 p-3 rounded">Red</div>
          <div className="bg-green-100 text-green-700 p-3 rounded">Green</div>
          <div className="bg-blue-100 text-blue-700 p-3 rounded">Blue</div>
        </div>
      </div>
    </div>
  )
}
