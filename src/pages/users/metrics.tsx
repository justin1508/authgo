import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from "@chakra-ui/react";

import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";

import { AuthContext } from "../../contexts/AuthContext";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { setupAPIClient } from "../../services/api";



export default function metrics() {

	return (
		<Box>
			<Header />

			<Flex w="100%" my="6" maxWidth={1480} mx="auto" px={["4", "6"]}>
				<Sidebar />


				<h1>metRICS</h1>

			</Flex>
		</Box>
	);
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
	const apiClient = setupAPIClient(ctx);

	const response = await apiClient.get("/me");

	console.log(response.data);

	return {
		props: {}
	}
}, {
	permissions: ["metrics.list"],
	roles: ["administrator"]
});