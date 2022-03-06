import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthOTokenError } from "../services/errors/AuthTokenError";
import decode from "jwt-decode";
import { validadeUserPermissions } from "./validadeUserPermissions";
//high order function
//uma função que ela pode retornar uma função, ou receber como parametro uma função e executar essa função 

type WithSSRAuthOptions = {
	permissions?: string[];
	roles?: string[];
}

//está retornar uma função dentro de outra função
export function withSSRAuth<P>(fn: GetServerSideProps<P>, options?: WithSSRAuthOptions) {
	return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
		const cookies = parseCookies(ctx);
		const token = cookies["nextauth.token"];

		if (!token) {
			return {
				redirect: {
					destination: "/",
					permanent: false,//redirecionamento nao permanente
				}
			}
		}

		if (options) {
			const user = decode<{ permissions: string[], roles: string[] }>(token);
			console.log(user)

			const { permissions, roles } = options;

			const userHasValidPermissions = validadeUserPermissions({ user, permissions, roles })

			if (!userHasValidPermissions) {
				return {
					redirect: {
						destination: "/dashboard",
						permanent: false
					}
				}
			}
		}





		try {
			return await fn(ctx);
		} catch (err) {
			console.log(err instanceof AuthOTokenError)
			console.log(err)
			if (err instanceof AuthOTokenError) {
				destroyCookie(ctx, "nextauth.token");
				destroyCookie(ctx, "nextauth.refreshToken");

				return {
					redirect: {
						destination: "/",
						permanent: false,//redirecionamento nao permanente
					}
				}
			}
		}
	}
}