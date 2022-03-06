import Router from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { api } from "../services/apiClient";

type User = {
	email: string;
	permissions: string[];
	roles: string[];
}

type SignInCredentials = {
	email: string;
	password: string;
}

type AuthContextData = {
	signIn: (credentials: SignInCredentials) => Promise<void>;
	signOut: () => void;
	user: User;
	isAuthenticated: boolean;
};

type AuthProviderProps = {
	children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export function signOut() {
	destroyCookie(undefined, "nextauth.token");
	destroyCookie(undefined, "nextauth.refreshToken");

	authChannel.postMessage("signOut");

	Router.push("/");
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User>();
	const isAuthenticated = !!user;

	useEffect(() => {
		authChannel = new BroadcastChannel("auth");

		authChannel.onmessage = (message) => {
			console.log(message);
			switch (message.data) {
				case "signOut":
					signOut();
					break;
				// case "signIn":
				// 	Router.push("/dashboard");
				// 	break;
				default:
					break;
			}
		}
	}, [])

	useEffect(() => {
		const { "nextauth.token": token } = parseCookies();
		console.log('token')
		console.log(token)

		if (token) {
			api.get("/me").then(response => {
				const { email, permissions, roles } = response.data;

				setUser({ email, permissions, roles });
			}).catch(() => {
				signOut();
			});
		}
	}, [])

	async function signIn({ email, password }: SignInCredentials) {
		// console.log(JSON.stringify({ email, password }, null, 2));
		try {
			const response = await api.post("sessions", {
				email,
				password,
			});

			const { token, refreshToken, permissions, roles } = response.data;
			// sessionStorage (se abrir e fechar o navegador, perde as informacoes)
			// localStorage (so existe no browser, next nao tem acesso SSR)
			// cookies (armazena no browser e next tem acesso)

			// setCookie(undefined, "teste") lado do browser
			// setCookie(_, "teste") lado do next SSR

			setCookie(undefined, "nextauth.token", token, {
				maxAge: 60 * 60 * 24 * 30, //30 dias//qnt tempo o cookie vai ficar armazenado no browser
				path: "/" // quais caminhos da aplicaçao tera acesso ao cookie
			})

			setCookie(undefined, "nextauth.refreshToken", refreshToken, {
				maxAge: 60 * 60 * 24 * 30, //30 dias//qnt tempo o cookie vai ficar armazenado no browser
				path: "/" // quais caminhos da aplicaçao tera acesso ao cookie
			})

			setUser({ email, permissions, roles });

			// console.log(response.data)

			api.defaults.headers["Authorization"] = `Bearer ${token}`

			Router.push("/users/create");

			// authChannel.postMessage("signIn");
		} catch (error) {
			console.log(error)
		}

	}
	return (
		<AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
			{children}
		</AuthContext.Provider>
	);
}