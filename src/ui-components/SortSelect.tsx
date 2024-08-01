import { Select } from "@chakra-ui/react";

import { SortKeys, SortKeyAndAscAsString } from "../types";

type SortSelectProps = {
  selectedSortMethodKeyComputed: SortKeyAndAscAsString;
  onSortChange: (val: SortKeyAndAscAsString) => void;
};

const sortOptions: Array<{ name: string, key: SortKeys, isAsc: boolean }> = [{
  name: "Data utworzenia: rosnąco",
  key: 'dateCreated',
  isAsc: true,
}, {
  name: "Data utworzenia: malejąco",
  key: "dateCreated",
  isAsc: false,
}, {
  name: "Data modyfikacji: rosnąco",
  key: "dateLastModified",
  isAsc: true,
}, {
  name: "Data modyfikacji: malejąco",
  key: "dateLastModified",
  isAsc: false,
}];

export const SortSelect = ({selectedSortMethodKeyComputed, onSortChange}: SortSelectProps) => {

  const sortBy = (val:SortKeyAndAscAsString) => {
    onSortChange(val);
  }

  return (
    <div>
      <Select
        value={selectedSortMethodKeyComputed}
        placeholder='Sortowanie'
        onChange={e => sortBy(e.target.value as SortKeyAndAscAsString)}
      >
        {sortOptions.map((tag) => (
          <option
            key={`${tag.key}__${tag.isAsc ? 'asc' : 'desc'}`}
            value={`${tag.key}__${tag.isAsc ? 'asc' : 'desc'}`}
          >
            {tag.name}
          </option>
        ))}
      </Select>
    </div>
  )
}

//1. add props onClick,
//2. pass tags to Sort component
//3. get Event sortBy in App.tsx 