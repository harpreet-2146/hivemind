// import { useState } from 'react';

// function SearchBar({ onSearch, loading }) {
//   const [query, setQuery] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (query.trim()) {
//       onSearch(query.trim());
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="w-full">
//       <div className="relative flex items-center">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search topics... (e.g., neural networks)"
//           disabled={loading}
//           className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors"
//         />
//         <span className="absolute left-3 text-gray-500">🔍</span>
//         <button
//           type="submit"
//           disabled={loading || !query.trim()}
//           className="absolute right-2 px-3 py-1 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-medium rounded transition-colors text-sm"
//         >
//           {loading ? '...' : 'Go'}
//         </button>
//       </div>
//     </form>
//   );
// }

// export default SearchBar;

import { useState } from 'react';

function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className="
          relative flex items-center 
          backdrop-blur-xl 
          bg-white/5 
          border border-white/10 
          shadow-[0_0_20px_rgba(93,52,255,0.25)] 
          rounded-2xl 
          overflow-hidden
          transition
          focus-within:shadow-[0_0_28px_rgba(115,66,255,0.45)]
        "
      >
        <span className="absolute left-4 text-indigo-300 text-lg pointer-events-none">
          🔍
        </span>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics… (e.g., neural networks)"
          disabled={loading}
          className="
            w-full 
            pl-12 pr-24 py-3 
            bg-transparent 
            text-white 
            placeholder-indigo-300/50
            focus:outline-none
            text-base 
            tracking-wide
          "
        />

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="
            absolute right-3 
            px-5 py-2
            rounded-xl 
            text-sm font-semibold
            transition-all
            bg-indigo-500/80 
            hover:bg-indigo-400 
            disabled:bg-indigo-700/40
            disabled:text-indigo-300/40
            text-white
            backdrop-blur-md
            shadow-[0_0_12px_rgba(115,66,255,0.45)]
            hover:shadow-[0_0_16px_rgba(135,86,255,0.7)]
          "
        >
          {loading ? '...' : 'Go'}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
