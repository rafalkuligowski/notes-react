import { Box, type BoxProps, Image, IconButton, Text, Flex, Icon } from "@chakra-ui/react";
import { PencilIcon } from "lucide-react";
import { convertDate } from "../utils/date";

type NoteProps = {
    id: string;
    tagColor: string;
    content: string;
    dateCreated: Date;
    dateLastModified: null | Date;
    imageUrl: string | null;
    status: string,
    onEditClick: (noteId: string) => void;
}

export const Note = ({id, tagColor, content, dateCreated, dateLastModified, imageUrl, onEditClick, status, ...rest}: NoteProps & BoxProps) => {

    return (
        <Box bg={tagColor} borderRadius='lg' {...rest} borderWidth='1px' overflow='hidden'>
                {imageUrl ? <Image w='200px' h='200px' src={imageUrl} /> : <div style={{backgroundColor: 'white', height: '200px'}}></div>}
                <Box p='4'>
                    <b><Text fontSize='sm' as={status === 'zakończona' ? 's': 'b'} mb='3' display='block'>{content}</Text></b>
                    <Text fontSize='xs'>
                        d. utworzenia: {convertDate(dateCreated)}
                    </Text>
                    <Text fontSize='xs'>
                        {dateLastModified !== null && 'd. modyfikacji:' + convertDate(dateLastModified)}
                    </Text>
                    <Text fontSize='xs'>
                        status: {status}
                    </Text>
                    <Flex justifyContent={'end'} pt="4">
                        <IconButton aria-label="edytuj" icon={<Icon as={PencilIcon} />} borderRadius={'full'} size="sm" onClick={() => onEditClick(id)} />
                    </Flex>
                </Box>
        </Box>
    )
}