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
  Input,
} from '@chakra-ui/react'

import { type Tag } from '../App';
import { HexColorPicker } from 'react-colorful';
import { getUUID } from '../utils/crypto';

type AddTagProps = {
    onSave: (tag: Tag) => void;
    isOpen: boolean;
    onClose: () => void;
};


export const NewTag = ({onSave, isOpen, onClose}: AddTagProps) => {
    const [tag, setTag] = useState({
        id: getUUID(),
        label: '',
        color: '#aabbcc',
    });
    const saveTag = () => {
        if (tag.label === '' ) {
            return
        } else {
            onSave(tag);
        }
    }
    const handleInputChange = (val: string) => {
        setTag({...tag, label: val})
    }
    const handleColorhange = (val: string) => {
        setTag({...tag, color: val})
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add tag</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input onChange={(e) => handleInputChange(e.target.value)} placeholder='Wpisz nazwę kategori' size="md" />
                    <HexColorPicker color={tag.color} onChange={handleColorhange} />;
                </ModalBody>

                <ModalFooter gap="3">
                    <Button colorScheme='blue' onClick={() => saveTag()}>
                        Zapisz
                    </Button>
                    <Button variant='ghost' onClick={onClose}>
                        Anuluj
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}