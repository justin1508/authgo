import { Flex, Button, Stack } from '@chakra-ui/react';
import { Input } from '../components/Form/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { isGeneratorObject } from 'util/types';
import { withSSRGuest } from '../utils/withSSRGuest';

type SignInFormData = {
	email: string;
	password: string;
}

const signInFormSchema = yup.object().shape({
	email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
	password: yup.string().required("Senha obrigatória"),
})

export default function Sign() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("")

	const { signIn } = useContext(AuthContext);

	const { register, handleSubmit, formState } = useForm({
		resolver: yupResolver(signInFormSchema),
	})
	const { errors } = formState;

	const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
		await new Promise((resolve, reject) => { setTimeout(resolve, 2000) })
		console.log(JSON.stringify(values, null, 2));

		//await signIn(values);
		//new
		// event.preventDefault();
		const data = {
			email,
			password
		}
		await signIn(data);
	}

	return (
		<Flex
			w="98vw"
			h="98vh"
			align="center"
			justify="center"
		>
			<Flex
				as="form"
				width="100%"
				maxWidth={360}
				bg="gray.800"
				p="8"
				borderRadius={8}
				flexDir="column"
				onSubmit={handleSubmit(handleSignIn)}
			>
				<Stack spacing="4">
					<Input name="email" type="email" label="E-mail" error={errors.email} {...register('email')} onChange={e => setEmail(e.target.value)} />
					<Input name="password" type="password" label="Senha" error={errors.password} {...register('password')} onChange={e => setPassword(e.target.value)} />
				</Stack>
				<Button type="submit" mt="6" colorScheme="pink" size="lg" isLoading={formState.isSubmitting} >Entrar</Button>
			</Flex>
		</Flex>
	)
}

//verificação do cookies do lado no servidor SSR
// export const getServerSideProps: GetServerSideProps = withSSRGuest<{ users: string[] }>(async (ctx) => {
export const getServerSideProps = withSSRGuest(async (ctx) => {
	// console.log(ctx.req.cookies);
	// const cookies = parseCookies(ctx);

	// if (cookies["nextauth.token"]) {
	// 	return {
	// 		redirect: {
	// 			destination: "/dashboard",
	// 			permanent: false,//redirecionamento nao permanente
	// 		}
	// 	}
	// }

	return {
		// props: {
		// 	users: ["213"]
		// }
		props: {}
	}
});