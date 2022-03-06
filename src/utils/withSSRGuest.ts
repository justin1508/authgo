import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

//high order function
//uma função que ela pode retornar uma função, ou receber como parametro uma função e executar essa função 

//está retornar uma função dentro de outra função
export function withSSRGuest<P>(fn: GetServerSideProps<P>) {
	return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
		const cookies = parseCookies(ctx);

		if (cookies["nextauth.token"]) {
			return {
				redirect: {
					destination: "/dashboard",
					permanent: false,//redirecionamento nao permanente
				}
			}
		}

		return await fn(ctx);
	}
}