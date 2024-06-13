import { Box, type BoxProps, IconButton, Flex, Icon } from "@chakra-ui/react";
import { PencilIcon } from "lucide-react";

type NoteProps = {
    id: string;
    tagColor: string;
    content: string;
    onEditClick: (noteId: string) => void;
}

export const Note = ({id, tagColor, content, onEditClick, ...rest}: NoteProps & BoxProps) => {
    return (
        <Box bg={tagColor} borderRadius='lg' p='4' {...rest}>
                {content}
            <Flex justifyContent={'end'} pt="4">
                <IconButton aria-label="edytuj" icon={<Icon as={PencilIcon} />} borderRadius={'full'} size="sm" onClick={() => onEditClick(id)} />
            </Flex>
        </Box>
    )
}