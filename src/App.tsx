import { useReducer, useState } from 'react'
import { Box, Button, Circle, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Spacer, VStack, useDisclosure } from '@chakra-ui/react'

import { SearchInput } from './ui-components/SearchInput';
import { Note } from './ui-components/Note';
import { getUUID } from './utils/crypto';
import { NoteEditor } from './ui-components/NoteEditor';
import { NewTag } from './ui-components/NewTag';

// TODO: 0. add lucide-react icons and extend search input with search icon
// TODO: 1. style note and add edit button + get background color from tagId (getTagColor)
// TODO: 2. add addNote function to component that extends notes (setNotes...)
// TODO: 3. add modifyNote function to "overwrite" existing note (setNotes...)

// TODO: 3a. handle tag setting/change with creation/edition
// TODO: 4. extend Add Tag with Modal where you can put name and pick color <Input type="color"
// TODO: 5. extend notes with dateCreated and lastModified date
// TODO: 6. add sortBy functionality by either dateCreated or lastModified

export type Tag = {
  id: number | string;
  color: string;
  label: string;
}

export type Note = {
  id: string;
  content: string;
  tagId: number | null;
}

const initialTags: Tag[] = [
  {
    id: 1,
    color: '#e4f3f2',
    label: 'Dom'
  },
  {
    id: 2,
    color: '#f4d3f2',
    label: 'Praca'
  }
];

type EditorDataNewAction = {
  type: 'new';
  payload: null;
};
type EditorDataEditAction = {
  type: 'edit';
  payload: Note;
}

type EditorDataAction = EditorDataNewAction | EditorDataEditAction;

function modifyEditorData(_state: Note, action: EditorDataAction) {
  switch(action.type) {
    case 'new':
      return { id: getUUID(), content: '', tagId: null }
      break;
    case 'edit':
      return { ...action.payload }
      break;
  }
}

function App() {
  const [tags, setTags] = useState(initialTags)
  const [notes, setNotes] = useState<Note[]>([{
    id: 'zzzz',
    content: 'hehehehe',
    tagId: 1
  }, {
    id: 'xxxx',
    content: 'siema pranie',
    tagId: 2
  }]);
  const [searchString, setSearchString] = useState('');
  
  const [newEditorData, setNewEditorDataDispatch] = useReducer(modifyEditorData, {id: getUUID(), content: '', tagId: null});
  const { isOpen: isEditorOpen, onOpen: onEditorOpen, onClose: onEditorClose } = useDisclosure()
  const { isOpen: isNewTagOpen, onOpen: onNewTagOpen, onClose: onNewTagClose } = useDisclosure()




  const getTagColor = (tagId: number | null) => {
    const defaultTagColor = '#eee';
    if (!tagId) return defaultTagColor;
    const foundTag = tags.find(tag => tag.id === tagId);
    return foundTag?.color ?? defaultTagColor;
  }

  const addNote = (newNote: Note) => {
    const existingNoteId = notes.findIndex(n => n.id === newNote.id);
    if (existingNoteId !== -1) {
      const tempNotes = notes;
      tempNotes[existingNoteId] = newNote;
      setNotes(tempNotes);
    } else {
      setNotes([...notes, newNote])
    }
    onEditorClose();
  }

  const addTag = (newTag: Tag) => {
    console.log("addTag");
    setTags([...tags, newTag]);
  }

  const filteredNotes = searchString === '' ? notes : notes.filter(note => note.content.toLowerCase().includes(searchString.toLowerCase()));

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

  const openNewTag = () => {
    onNewTagOpen();
  }

  return (
    <>
    <Flex minH="100vh">
      <Box w='100px'>
        <VStack spacing={4} p="4">
          <Box fontWeight={700}>notes</Box>
          <Spacer />
          {tags.map(e => <Circle key={e.id} size='16px' bg={e.color} />)}
          {/* <Button size={'xs'} borderRadius={'full'} onClick={() => addTag('Wakacje', '#ddd')}>+</Button> */}
          <Button size={'xs'} borderRadius={'full'} onClick={() => openNewTag()}>+</Button>
        </VStack>
      </Box>
      <Box flex='1'>
        <VStack spacing={4} alignItems={'flex-start'} pt="4">
          <Flex alignItems={'center'} gap="4">
            <SearchInput value={searchString} onChange={setSearchString} />
          </Flex>
          <Flex gap="4" alignItems={'center'}>
            <Heading>Your Notes</Heading>
            <Button size="sm" colorScheme='orange' onClick={() => openNoteEditor()}>+</Button>
          </Flex>
          <SimpleGrid columns={[1, 2, 3, 4]} spacing="6">
            {filteredNotes.length === 0 && <Box>Brak wynikow</Box>}
            {filteredNotes.map(note => 
              <Note key={note.id} id={note.id} content={note.content} tagColor={getTagColor(note.tagId)} onEditClick={(id) => openNoteEditor(id)} />
            )}
          </SimpleGrid>
        </VStack>
      </Box>
    </Flex>
    <NoteEditor onSave={addNote} notePayload={newEditorData} isOpen={isEditorOpen} tags={tags} onClose={onEditorClose} />
    <NewTag onSave={addTag} isOpen={isNewTagOpen} onClose={onNewTagClose} />
    </>
  )
}

export default App
