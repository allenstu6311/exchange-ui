import { createStandaloneToast } from "@chakra-ui/react";

const { toast } = createStandaloneToast();

export const successToast = (title: string, description: string) => {
  toast({
    title: title,
    description: description,
    status: "success",
    duration: 3000,
    isClosable: true,
    position: "top",
  });
};

export const errorToast = (title: string, description: string) => {
  toast({
    title: title,
    description: description,
    status: "error",
    duration: 3000,
    isClosable: true,
    position: "top",
  });
};
