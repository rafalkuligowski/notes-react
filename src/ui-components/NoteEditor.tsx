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
    Circle,
    Select,
} from '@chakra-ui/react'

import { Tag, type Note } from '../types/index'
import React from 'react';
import axios from 'axios';


type NoteEditorProps = {
    onSave: (note: Note) => void;
    notePayload: Note;
    isOpen: boolean;
    onClose: () => void;
    tags: Array<Tag>
};


export const NoteEditor = (props: NoteEditorProps) => {
    const [content, setContent] = useState(props.notePayload.content);
    const [imageRandomUrl, setRandomImageUrl] = useState(props.notePayload.imageUrl);
    const [selectedTagId, setSelectedTagId] = useState(props.notePayload.tagId ?? null);
    const [modalTitle, setModalTitle] = useState('');


    React.useEffect(() => {
        setContent(props.notePayload.content);
        setSelectedTagId(props.notePayload.tagId ?? null);
        setRandomImageUrl(props.notePayload.imageUrl ?? '');
        setModalTitle(props.notePayload.type === 'new' ? 'Nowa notatka' : 'Edycja notatki');
    }, [props])


    const saveNote = () => {
        if (content === '') {
            return;
        }
        const newNote = {
            id: props.notePayload.id,
            content: content,
            tagId: props.notePayload.tagId !== selectedTagId ? selectedTagId : props.notePayload.tagId,
            dateCreated: props.notePayload.dateCreated !== null ? props.notePayload.dateCreated : new Date(),
            dateLastModified: props.notePayload.content !== '' ? new Date() : null,
            imageUrl: imageRandomUrl,
            status: props.notePayload.status ? props.notePayload.status : 'nowa',
        }
        props.onSave(newNote);
    }

    const handleTextAreaChange = (val: string) => {
        setContent(val);
    }

    const getImageListJSON = () => {
        const apiUrl = 'https://picsum.photos/v2/list';
        const imageListJSON = axios.get(apiUrl);
        return imageListJSON;
    }
    const randomInteger = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const generateRandomImage = async () => {
        const imageListJSON = await getImageListJSON();
        const imageListLength = imageListJSON.data.length;
        const randomImageIndex = randomInteger(1, imageListLength);
        setRandomImageUrl(imageListJSON.data[randomImageIndex].download_url);
    }

    const selectedTag = props.tags.find(tag => tag.id === selectedTagId) ?? null;

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{modalTitle}</ModalHeader>
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
                            {props.tags.map(tag => 
                                <MenuItem key={tag.id} icon={<Circle size="20px" bg={tag.color} />} onClick={() => setSelectedTagId(tag.id)}>
                                    {tag.label}
                                </MenuItem>)}
                        </MenuList>
                    </Menu>
                    {imageRandomUrl && <img src={imageRandomUrl} />}
                    <Button onClick={() => generateRandomImage()}>Generuj grafikę</Button>
                    {/* <Select placeholder='Sortowanie' onChange={e => setStatus(e.target.value)}>
                        {statuses.map((status: Status) => (
                            <option key={status.name} value={tag.name}>{tag.name}</option>
                        ))}
                    </Select> */}
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