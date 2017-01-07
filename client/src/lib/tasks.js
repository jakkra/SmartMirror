const checkStatus = (res) => {
    return new Promise((resolve, reject) => {
        if (res.status >= 200 && res.status < 299) {
            return resolve(res);
        } else {
            const error = new Error(`StatusCode: ${res.status}, message: ${res.statusText}`);
            return reject(error);
        }
    });
};


export function getTasks(callback) {
	const url = 'http://localhost:3000/api/tasks';

	return fetch(url)
  .then(checkStatus)
  .then(res => res.json())
  .then(res => res.tasks)
}
