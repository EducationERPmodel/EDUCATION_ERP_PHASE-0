import React from 'react';
import SearchBar from '../dashboard/SearchBar';

export default function SearchIAMarks({ search, setSearch }) {
  return <SearchBar search={search} setSearch={setSearch} placeholder="Search Student..." />;
}
