// import { useState } from 'react';

// function SearchBar({ onSearch, loading }) {
//   const [query, setQuery] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSearch(query);
//   };

//   return (
//     <form className="search-bar" onSubmit={handleSubmit}>
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Search concepts... (e.g., neural networks, deep learning)"
//         disabled={loading}
//       />
//       <button type="submit" disabled={loading}>
//         {loading ? '...' : '🔍'}
//       </button>
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
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics... (e.g., neural networks)"
          disabled={loading}
          className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors"
        />
        <span className="absolute left-3 text-gray-500">🔍</span>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 px-3 py-1 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-medium rounded transition-colors text-sm"
        >
          {loading ? '...' : 'Go'}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;