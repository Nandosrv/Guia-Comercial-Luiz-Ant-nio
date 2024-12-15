function deleteCookie(name: string) {
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// funcao para atribuir cookies
function setCookie(name: string, value: string, days: number) {
	let expires = '';
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = `; expires=${date.toUTCString()}`;
	}
	document.cookie = `${name}=${value || ''}${expires}; path=/`;
}

function setLastPathUrl(pathName: string) {
	setCookie('lastPathUrl', pathName, 3);
}

export { deleteCookie, setCookie, setLastPathUrl };
