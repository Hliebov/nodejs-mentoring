const mockUsers = [
	{id: '1', name: 'Alex'},
	{id: '2', name: 'John'},
	{id: '3', name: 'Bob'},
	{id: '4', name: 'Andre'}
];


Users = {
	getAll() {
		return mockUsers;
	}
};

module.exports = Users;