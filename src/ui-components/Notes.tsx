import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useReducer, useState } from "react";
import {
  type Note as NoteType,
  type Tag,
  type EditorDataAction,
  type SortKeys,
  type SortKeyAndAscAsString,
  Status,
} from "../types";
import { SearchInput } from "./SearchInput";
import { SortSelect } from "./SortSelect";
import { Note } from "./Note";
import { getUUID } from "../utils/crypto";
import { NoteEditor } from "./NoteEditor";
import { isEqual, omit } from "lodash";

type Props = {
  tags: Tag[]
};

export const Notes = ({tags}: Props) => {
  const [searchString, setSearchString] = useState("");
  const [notes, setNotes] = useState<NoteType[]>([{
      id: 'zzzz',
      content: 'hehehehe',
      tagId: 1,
      dateCreated: new Date('December 17, 1995 03:24:00'),
      dateLastModified: new Date('June 26, 2024 03:24:00'),
      imageUrl: `https://picsum.photos/id/${Math.floor(Math.random() * 90)}/200/200`,
      status: { id: 1, label: 'nowa' }
  }, {
      id: 'xxxx',
      content: 'siema pranie',
      tagId: 2,
      dateCreated: new Date('December 12, 2021 03:24:00'),
      dateLastModified: new Date('June 22, 2024 03:24:00'),
      imageUrl: `https://picsum.photos/id/${Math.floor(Math.random() * 90)}/200/200`,
      status: { id: 2, label: 'w trakcie' }
  }, {
      id: 'xxrwe',
      content: 'trzecia notatka',
      tagId: 2,
      dateCreated: new Date('December 12, 2000 03:24:00'),
      dateLastModified: new Date('June 22, 2022 02:24:00'),
      imageUrl: `https://picsum.photos/id/${Math.floor(Math.random() * 90)}/200/200`,
      status: { id: 3, label: 'zakończona' }
  }, {
      id: 'ggxx',
      content: 'czwarta notatka',
      tagId: 2,
      dateCreated: new Date('December 12, 2017 03:24:00'),
      dateLastModified: new Date('June 22, 2019 03:24:00'),
      imageUrl: `https://picsum.photos/id/${Math.floor(Math.random() * 90)}/200/200`,
      status: { id: 1, label: 'nowa' }
  }]);
  const sortBy = (arr: NoteType[], key: string, isNotReverse: boolean) => {
    // return reverse ? arr.sort((a, b) => keys.reduce((acc, key) => acc !== 0 ? acc : a[key] - b[key], 0)) : arr.sort((a, b) => keys.reduce((acc, key) => acc !== 0 ? acc : a[key] - b[key], 0)).reverse();
    arr.sort((a, b) => {
      const keyA = a[key];
      const keyB = b[key];
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    isNotReverse ? arr : arr.reverse();
    return arr;
  };
  const [sortMethod, setSortMethod] = useState<{ key: SortKeys, isAsc: boolean }>({ key: 'dateCreated', isAsc: true });

  function modifyEditorData(_state: NoteType, action: EditorDataAction) {
    switch (action.type) {
        case 'new':
            return { id: getUUID(), content: '', tagId: null, dateCreated: new Date(), dateLastModified: null, type: "new", imageUrl: '', status: { id: 1, label: 'nowa' } }
        case 'edit':
            return { ...action.payload, type: 'edit' }
    }
  }

  const handleSortMethodChange = (keyCombined: SortKeyAndAscAsString) => {
      const [key, ascOrDesc] = keyCombined.split('__') as [SortKeys, string];
      // To explain: why not this?
      // const [key, ascOrDesc]: [SortKeys, string] = keyCombined.split('__');
      const isAsc = ascOrDesc === 'asc';
      setSortMethod({ key, isAsc });
  }
  const statuses: Status[] = [
      {id: 1, label: 'nowa'},
      {id: 2, label: 'w trakcie'},
      {id: 3, label: 'zakończona'}
  ]
  const getTagColor = (tagId: number | null) => {
      const defaultTagColor = '#eee';
      if (!tagId) return defaultTagColor;
      const foundTag = tags.find(tag => tag.id === tagId);
      return foundTag?.color ?? defaultTagColor;
  }
  const [newEditorData, setNewEditorDataDispatch] = useReducer(modifyEditorData, { id: getUUID(), content: '', tagId: null, dateCreated: new Date(), dateLastModified: null, imageUrl: null, status: { id: 1, label: 'nowa' }, type: "new" });
  const openNoteEditor = (noteId?: string) => {
      const note = notes.find(note => note.id === noteId) ?? null;
      if (note) {
          setNewEditorDataDispatch({
              type: 'edit',
              payload: note
          });
      } else {
          setNewEditorDataDispatch({
              type: 'new',
              payload: null
          });
      }
      onEditorOpen();
  }
  const addNote = (newNote: NoteType) => {
      const existingNoteId = notes.findIndex(n => n.id === newNote.id);
      if (existingNoteId !== -1) {
          // const tempNotes = notes;
          // const result = isEqual(
          //     omit(tempNotes[existingNoteId], ['dateLastModified']),
          //     omit(newNote, ['dateLastModified'])
          // );
          // if (result) return;
          // tempNotes[existingNoteId] = newNote;
          // setNotes(tempNotes);
          // Why not?
          setNotes(notes.map(note => note.id === newNote.id ? newNote : note));
      } else {
          setNotes([...notes, newNote]);
      }
      onEditorClose();
  }
  const filterNotesBySearch = (notes: NoteType[], searchString: string) => {
      return searchString === '' ? notes : notes.filter(note => note.content.toLowerCase().includes(searchString.toLowerCase()));
  }
  const { isOpen: isEditorOpen, onOpen: onEditorOpen, onClose: onEditorClose } = useDisclosure()


  const orderNotesBySortMethod = (
    notes: NoteType[],
    sortMethod: { key: SortKeys; isAsc: boolean }
  ) => {
    // To explain: why sortMethod.key instead of sortMethod.isAsc?
    // return sortMethod.key === 'dateCreated' ? sortBy(notes, [sortMethod.key], sortMethod.isAsc) : sortBy(notes, [sortMethod.key], sortMethod.isAsc).reverse();
    return sortBy(notes, sortMethod.key, sortMethod.isAsc);
  };
  const orderedNotes: NoteType[] = orderNotesBySortMethod(notes, sortMethod);
  const filteredNotes = filterNotesBySearch(orderedNotes, searchString);
  return (
    <div>
      <Box flex="1">
        <VStack spacing={4} alignItems={"flex-start"} pt="4">
          <Flex alignItems={"center"} gap="4">
            <SearchInput value={searchString} onChange={setSearchString} />
          </Flex>
          <Flex gap="4" alignItems={"center"}>
            <Heading>Your Notes</Heading>
            <Button
              size="sm"
              colorScheme="orange"
              onClick={() => openNoteEditor()}
            >
              +
            </Button>
          </Flex>
          <SortSelect
            selectedSortMethodKeyComputed={`${sortMethod.key}__${sortMethod.isAsc ? "asc" : "desc"}`}
            onSortChange={handleSortMethodChange}
          />
          <SimpleGrid columns={[1, 2, 3, 4, 5]} spacing="6">
            {filteredNotes.length === 0 && <Box>Brak wynikow</Box>}
            {filteredNotes.map((note) => (
              <Note
                key={note.id}
                id={note.id}
                status={note.status}
                dateCreated={note.dateCreated}
                dateLastModified={note.dateLastModified}
                imageUrl={note.imageUrl}
                content={note.content}
                tagColor={getTagColor(note.tagId)}
                onEditClick={(id) => openNoteEditor(id)}
              />
            ))}
          </SimpleGrid>
        </VStack>
      </Box>
      <NoteEditor onSave={addNote} notePayload={newEditorData} isOpen={isEditorOpen} statuses={statuses} tags={tags} onClose={onEditorClose} />
    </div>
  );
};
