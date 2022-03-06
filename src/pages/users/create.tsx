import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { Input } from "../../components/Form/Input";
// import { useMutation } from "react-query";
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";

import { useRouter } from "next/router";

import { useContext, useEffect } from "react"
import { AuthContext } from "../../contexts/AuthContext";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { api } from "../../services/apiClient";
import { setupAPIClient } from "../../services/api";
import { useCan } from "../../services/hooks/useCan";
import { Can } from "../../components/Can";

type CreateUserFormData = {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;
}

const createUserFormSchema = yup.object().shape({
	name: yup.string().required("Nome obrigatório"),
	email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
	password: yup.string().required("Senha obrigatória").min(6, "Mínimo 6 caracteres"),
	password_confirmation: yup.string().oneOf([null, yup.ref("password")], "As senhas não batem")
})

export default function CreateUser() {
	const router = useRouter();

	const userCanSeeMatrics = useCan({
		permissions: ["metrics.list"]
	});

	// const userCanSeeMatrics = useCan({
	// 	roles: ["administrator","editor"]
	// });

	useEffect(() => {
		api.get("/me")
			.then(response => console.log(response))
			.catch(error => console.log(error))
	}, [])

	const { user, signOut } = useContext(AuthContext);

	// const createUser = useMutation(async (user: CreateUserFormData) => {
	// 	const response = await api.post("user", {
	// 		user: {
	// 			...user,
	// 			created_at: new Date(),
	// 		}
	// 	});

	// 	return response.data.user;
	// }, {
	// 	onSuccess: () => {
	// 		queryClient.invalidateQueries("users")
	// 	}
	// });

	const { register, handleSubmit, formState } = useForm({
		resolver: yupResolver(createUserFormSchema),
	})
	const { errors } = formState;

	const handleCreateUser: SubmitHandler<CreateUserFormData> = async (values) => {
		console.log('values')
		console.log(values)
		await createUser.mutateAsync(values);

		router.push("/users");
	}

	return (
		<Box>
			<Header />

			<Flex w="100%" my="6" maxWidth={1480} mx="auto" px={["4", "6"]}>
				<Sidebar />

				<Box as="form" flex="1" borderRadius={8} bg="gray.800" p="8" onSubmit={handleSubmit(handleCreateUser)}>
					<Heading size="lg" fontWeight="normal">Criar usuário</Heading>
					<Heading size="lg" fontWeight="normal">{user?.email}</Heading>

					<Divider my="6" borderColor="gray.700" />

					<VStack spacing="8">
						<SimpleGrid minChildWidth="240px" spacing={["4", "6"]} w="100%">
							<Input name="name" label="Nome completo" error={errors.name} {...register('name')} />
							<Input name="email" type="email" label="E-mail" error={errors.email} {...register('email')} />
						</SimpleGrid>

						<SimpleGrid minChildWidth="240px" spacing={["4", "6"]} w="100%">
							<Input name="password" type="password" label="Senha" error={errors.password} {...register('password')} />
							<Input name="password_confirmation" type="password" label="Confirmação de senha" error={errors.password_confirmation} {...register('password_confirmation')} />
						</SimpleGrid>
					</VStack>

					{userCanSeeMatrics &&
						<Flex mt="8" justify="flex-end">
							<HStack spacing="4">
								<Link href="/users" passHref>
									<Button as="a" colorScheme="whiteAlpha">Cancelar</Button>
								</Link>
								<Button colorScheme="pink" type="submit" isLoading={formState.isSubmitting}>Salvar</Button>
								<Button colorScheme="pink" onClick={signOut} >SignOut</Button>
							</HStack>
						</Flex>
					}

					<Can permissions={["metrics.list"]}>
						<div>CAN SEEEEE</div>
					</Can>

				</Box>
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
});