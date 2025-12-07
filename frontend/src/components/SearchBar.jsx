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
