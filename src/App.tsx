import { useReducer, useState } from 'react'
import { Box, Button, Circle, Flex, Heading, SimpleGrid, Spacer, VStack, useDisclosure } from '@chakra-ui/react'
import { isEqual, omit } from 'lodash';

import { SearchInput } from './ui-components/SearchInput';
import { Note } from './ui-components/Note';
import { getUUID } from './utils/crypto';
import { NoteEditor } from './ui-components/NoteEditor';
import { NewTag } from './ui-components/NewTag';
import { SortSelect } from './ui-components/SortSelect';
import { type Note as NoteType, type Tag, type EditorDataAction, type SortKeys, type SortKeyAndAscAsString, Status } from './types';

// TODO: 0. add lucide-react icons and extend search input with search icon
// TODO: 1. style note and add edit button + get background color from tagId (getTagColor)
// TODO: 2. add addNote function to component that extends notes (setNotes...)
// TODO: 3. add modifyNote function to "overwrite" existing note (setNotes...)

// TODO: 3a. handle tag setting/change with creation/edition
// TODO: 4. extend Add Tag with Modal where you can put name and pick color <Input type="color"
// TODO: 5. extend notes with dateCreated and lastModified date
// TODO: 6. add sortBy functionality by either dateCreated or lastModified

// TODO: 7. Add select to add status note (nowe, w trakcie, zakończone)
// TODO: 8. Show status task
// TODO: 9. Manage statuses UI

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

function modifyEditorData(_state: NoteType, action: EditorDataAction) {
    switch (action.type) {
        case 'new':
            return { id: getUUID(), content: '', tagId: null, dateCreated: new Date(), dateLastModified: null, type: "new", imageUrl: '', status: { id: 1, label: 'nowa' } }
        case 'edit':
            return { ...action.payload, type: 'edit' }
    }
}

function App() {
    const [tags, setTags] = useState(initialTags)
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
    const [searchString, setSearchString] = useState('');
    const [sortMethod, setSortMethod] = useState<{ key: SortKeys, isAsc: boolean }>({ key: 'dateCreated', isAsc: true });

    const [newEditorData, setNewEditorDataDispatch] = useReducer(modifyEditorData, { id: getUUID(), content: '', tagId: null, dateCreated: new Date(), dateLastModified: null, imageUrl: null, status: { id: 1, label: 'nowa' }, type: "new" });
    const { isOpen: isEditorOpen, onOpen: onEditorOpen, onClose: onEditorClose } = useDisclosure()
    const { isOpen: isNewTagOpen, onOpen: onNewTagOpen, onClose: onNewTagClose } = useDisclosure()
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

    const addNote = (newNote: NoteType) => {
        const existingNoteId = notes.findIndex(n => n.id === newNote.id);
        if (existingNoteId !== -1) {
            const tempNotes = notes;
            const result = isEqual(
                omit(tempNotes[existingNoteId], ['dateLastModified']),
                omit(newNote, ['dateLastModified'])
            );
            console.log("equal");
            if (result) return;
            console.log("not equal");
            tempNotes[existingNoteId] = newNote;
            setNotes(tempNotes);
        } else {
            setNotes([...notes, newNote]);
        }
        onEditorClose();
    }

    const addTag = (newTag: Tag) => {
        setTags([...tags, newTag]);
        onNewTagClose();
    }

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

    const handleSortMethodChange = (keyCombined: SortKeyAndAscAsString) => {
        const [key, ascOrDesc] = keyCombined.split('__') as [SortKeys, string];
        // To explain: why not this?
        // const [key, ascOrDesc]: [SortKeys, string] = keyCombined.split('__');
        const isAsc = ascOrDesc === 'asc';
        setSortMethod({ key, isAsc });
    }

    const filterNotesBySearch = (notes: NoteType[], searchString: string) => {
        return searchString === '' ? notes : notes.filter(note => note.content.toLowerCase().includes(searchString.toLowerCase()));
    }

    const orderNotesBySortMethod = (notes: NoteType[], sortMethod: { key: SortKeys, isAsc: boolean }) => {
        // To explain: why sortMethod.key instead of sortMethod.isAsc?
        // return sortMethod.key === 'dateCreated' ? sortBy(notes, [sortMethod.key], sortMethod.isAsc) : sortBy(notes, [sortMethod.key], sortMethod.isAsc).reverse();
        return sortBy(notes, sortMethod.key, sortMethod.isAsc);
    }

    // const sortBy = (arr: NoteType[], keys: string[], reverse: boolean) => {
    const sortBy = (arr: NoteType[], key: string, isNotReverse: boolean) => {
        // return reverse ? arr.sort((a, b) => keys.reduce((acc, key) => acc !== 0 ? acc : a[key] - b[key], 0)) : arr.sort((a, b) => keys.reduce((acc, key) => acc !== 0 ? acc : a[key] - b[key], 0)).reverse();
        arr.sort((a, b) => {
            const keyA = a[key];
            const keyB = b[key];
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        })
        isNotReverse ? arr : arr.reverse();
        return arr;
    }

    const orderedNotes: NoteType[] = orderNotesBySortMethod(notes, sortMethod);
    const filteredNotes = filterNotesBySearch(orderedNotes, searchString);

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
                            <SortSelect selectedSortMethodKeyComputed={`${sortMethod.key}__${sortMethod.isAsc ? 'asc' : 'desc'}`} onSortChange={handleSortMethodChange} />
                        </Flex>
                        <SimpleGrid columns={[1, 2, 3, 4, 5]} spacing="6">
                            {filteredNotes.length === 0 && <Box>Brak wynikow</Box>}
                            {filteredNotes.map(note =>
                                <Note key={note.id} id={note.id} status={note.status} dateCreated={note.dateCreated} dateLastModified={note.dateLastModified} imageUrl={note.imageUrl} content={note.content} tagColor={getTagColor(note.tagId)} onEditClick={(id) => openNoteEditor(id)} />
                            )}
                        </SimpleGrid>
                    </VStack>
                </Box>
            </Flex>
            <NoteEditor onSave={addNote} notePayload={newEditorData} isOpen={isEditorOpen} statuses={statuses} tags={tags} onClose={onEditorClose} />
            <NewTag onSave={addTag} isOpen={isNewTagOpen} onClose={onNewTagClose} />
        </>
    )
}

export default App
