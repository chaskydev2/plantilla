/**
 * UnderConstruction Component
 * Displays a "nstruction" placeholder with animated loading dots
 */
const UnderConstruction = () => (
  <div className="min-h-96 flex items-center justify-center">
    <div className="text-center p-8">
      <div className="text-6xl mb-6">🚧</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Under Construction</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        This section is currently being built. Please check back later for updates.
      </p>
      <div className="flex justify-center space-x-2">
        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-stone-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  </div>
);

export default UnderConstruction;