type User = {
	permissions: string[];
	roles: string[];
}

type ValidadeUserPermissionsParams = {
	user: User;
	permissions?: string[];
	roles?: string[];
}

export function validadeUserPermissions({ user, permissions, roles }: ValidadeUserPermissionsParams) {
	if (permissions?.length > 0) {
		//every retorna TRUE se todas as condições forem satisfeitas
		const hasAllPermissions = permissions.every(permission => {
			return user.permissions.includes(permission);
		});

		if (!hasAllPermissions) {
			return false;
		}
	}

	if (roles?.length > 0) {
		//every retorna TRUE se todas as condições forem satisfeitas
		const hasAllRoles = roles.some(role => {
			return user.roles.includes(role);
		});

		if (!hasAllRoles) {
			return false;
		}
	}

	return true;
}