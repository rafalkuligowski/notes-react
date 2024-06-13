import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
//   MenuItemOption,
//   MenuGroup,
//   MenuOptionGroup,
//   MenuDivider,
  Circle,
} from '@chakra-ui/react'

import {Tag, type Note} from '../App'
import React from 'react';

type NoteEditorProps = {
    onSave: (note: Note) => void;
    notePayload: Note;
    isOpen: boolean;
    onClose: () => void;
    tags: Array<Tag>
};

export const NoteEditor = (props: NoteEditorProps) => {
    const [content, setContent] = useState(props.notePayload.content);
    console.log(props.notePayload.content);

    React.useEffect(() => {
        setContent(props.notePayload.content);
        setSelectedTagId(props.notePayload.tagId ?? null);
    }, [props])

    const [selectedTagId, setSelectedTagId] = useState(props.notePayload.tagId ?? null);

    const saveNote = () => {
        if (content === '') {
            return;
        }
        const newNote = {
            id: props.notePayload.id,
            tagId: props.notePayload.tagId !== selectedTagId ? selectedTagId : props.notePayload.tagId,
            content: content
        }
        props.onSave(newNote);
    }

    const handleTextAreaChange = (val: string) => {
        setContent(val);
    }

    const selectedTag = props.tags.find(tag => tag.id === selectedTagId) ?? null;

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Textarea value={content} onChange={(e) => handleTextAreaChange(e.target.value)} placeholder='Wpisz tekst notatki' size="md" />

                <Menu>
                    <MenuButton
                        as={Button}
                        variant='outline'
                    >
                        {selectedTag ? selectedTag.label : 'Wybierz Tag'}
                    </MenuButton>
                    <MenuList>
                        {props.tags.map(tag => <MenuItem key={tag.id} icon={<Circle size="20px" bg={tag.color} />} onClick={() => setSelectedTagId(tag.id)}>
                            {tag.label}
                        </MenuItem>)}
                    </MenuList>
                    </Menu>
            </ModalBody>

            <ModalFooter gap="3">
                <Button colorScheme='blue' onClick={() => saveNote()}>
                    Zapisz
                </Button>
                <Button variant='ghost' onClick={props.onClose}>Anuluj</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    )
}