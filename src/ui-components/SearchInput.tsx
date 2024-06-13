import { Input, Icon, InputGroup, InputRightElement } from "@chakra-ui/react";
import { SearchIcon } from "lucide-react";

type SearchInputProps = {
    value: string;
    onChange: (text: string) => void;
};

export const SearchInput = ({value, onChange}: SearchInputProps) => {
  return (
    <>
        <InputGroup>
            <Input
                value={value}
                onChange={({ target }) => onChange(target.value)}
                placeholder="Szukaj notatki..."
            />
            <InputRightElement>
              <Icon as={SearchIcon} color='gray.400' />
            </InputRightElement>
        </InputGroup>
    </>
  );
};
