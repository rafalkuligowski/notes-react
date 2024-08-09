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
import { Notes } from './ui-components/Notes';

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

function modifyEditorData(_state: NoteType, action: EditorDataAction) {
    switch (action.type) {
        case 'new':
            return { id: getUUID(), content: '', tagId: null, dateCreated: new Date(), dateLastModified: null, type: "new", imageUrl: '', status: { id: 1, label: 'nowa' } }
        case 'edit':
            return { ...action.payload, type: 'edit' }
    }
}

function App() {
    const [tags, setTags] = useState<Tag[]>([
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
    ]);

    const [newEditorData, setNewEditorDataDispatch] = useReducer(modifyEditorData, { id: getUUID(), content: '', tagId: null, dateCreated: new Date(), dateLastModified: null, imageUrl: null, status: { id: 1, label: 'nowa' }, type: "new" });
    const { isOpen: isEditorOpen, onOpen: onEditorOpen, onClose: onEditorClose } = useDisclosure()
    const { isOpen: isNewTagOpen, onOpen: onNewTagOpen, onClose: onNewTagClose } = useDisclosure()
    const statuses: Status[] = [
        {id: 1, label: 'nowa'},
        {id: 2, label: 'w trakcie'},
        {id: 3, label: 'zakończona'}
    ]

    // const addNote = (newNote: NoteType) => {
    //     const existingNoteId = notes.findIndex(n => n.id === newNote.id);
    //     if (existingNoteId !== -1) {
    //         const tempNotes = notes;
    //         const result = isEqual(
    //             omit(tempNotes[existingNoteId], ['dateLastModified']),
    //             omit(newNote, ['dateLastModified'])
    //         );
    //         console.log("equal");
    //         if (result) return;
    //         console.log("not equal");
    //         tempNotes[existingNoteId] = newNote;
    //         setNotes(tempNotes);
    //     } else {
    //         setNotes([...notes, newNote]);
    //     }
    //     onEditorClose();
    // }

    const addTag = (newTag: Tag) => {
        setTags([...tags, newTag]);
        onNewTagClose();
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
                <Notes tags={tags}/>
            </Flex>
            {/* <NoteEditor onSave={addNote} notePayload={newEditorData} isOpen={isEditorOpen} statuses={statuses} tags={tags} onClose={onEditorClose} /> */}
            <NewTag onSave={addTag} isOpen={isNewTagOpen} onClose={onNewTagClose} />
        </>
    )
}

export default App
