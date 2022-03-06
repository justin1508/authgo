import { Stack } from "@chakra-ui/react";
import { RiContactsLine, RiDashboardLine, RiGitMergeLine, RiInputMethodLine } from "react-icons/ri";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SidebarNav() {
	return (
		<Stack spacing="12" align="flex-start">
			<NavSection title="GERAL">
				<NavLink icon={RiDashboardLine} title="Dashboard" href="/dashboard" />
				<NavLink icon={RiContactsLine} title="Usuários" href="/users" />
			</NavSection>
			<NavSection title="AUTOMAÇÃO">
				<NavLink icon={RiInputMethodLine} title="Formulários" href="/forms" />
				<NavLink icon={RiGitMergeLine} title="Automação" href="/automation" />
			</NavSection>
		</Stack>
	);
}