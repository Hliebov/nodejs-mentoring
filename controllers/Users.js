const mockUsers = [
	{id: '1', name: 'Alex', password: '1'},
	{id: '2', name: 'John', password: '1'},
	{id: '3', name: 'Bob', password: '1'},
	{id: '4', name: 'Andre', password: '1'}
];


Users = {
	getAll() {
		return mockUsers;
	},
	validateUser(name, password) {
		let user = mockUsers.find((user) => name === user.name);
		return user && user.password === password;
	}
};

module.exports = Users;