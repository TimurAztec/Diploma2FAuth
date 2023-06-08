import React, { useState } from "react";
import { tr } from "../i18n";

interface PropsList {
  items: any[];
  renderItem: (item: any, index: number) => JSX.Element;
}

const CustomList: React.FC<PropsList> = ({ items, renderItem }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filterItems = (items: any[], searchTerm: string) => {
    return items.filter(
      (item) =>
        item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    );
  };

  const filteredItems = filterItems(items, searchTerm);

  return (
    <div className="w-full max-w-md mx-auto">
      <input
        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        type="text"
        placeholder={tr('search')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredItems.map((item, index) => (
          <li key={item.id}>{renderItem(item, index)}</li>
        ))}
      </ul>
    </div>
  );
};

export default CustomList;