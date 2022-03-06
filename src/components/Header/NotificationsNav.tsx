import { HStack, Icon } from "@chakra-ui/react";
import { RiNotificationLine, RiUserAddLine } from "react-icons/ri";

export function NotificationsNav() {
	return (
		<HStack
			spacing={["6", "8"]}
			mx={["6", "8"]}
			pr={["6", "8"]}
			py="2"
			color="gray.200"
			borderRight="1px solid "
			borderColor="gray.100"
		>
			<Icon as={RiNotificationLine} fontSize="20" />
			<Icon as={RiUserAddLine} fontSize="20" />

		</HStack>
	);
}