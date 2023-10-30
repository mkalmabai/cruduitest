const uri = 'https://localhost:5001/api/TodoItems';

export const addItem = async (item) => {
	const result = await fetch(uri, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(item)
	})
	.then(response => response.json());

	return result;
}

export const getItems = async () => {
	const res = await fetch(uri);
  	return await res.json();
}

export const deleteItem = async (id) => {
	await fetch(`${uri}/${id}`, {
		method: 'DELETE'
	});
	return;
}

export const updateItem = async (item) => {
	await fetch(`${uri}/${item.id}`, {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(item)
	})
	return;
}

