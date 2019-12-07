const fetchDog = (data) => {
    return { type: 'FETCHED_DOG', data }
};

const requestDog = () => {
    return { type: 'REQUESTED_DOG' }
};

const requestDogSuccess = (data) => {
    return { type: 'REQUESTED_DOG_SUCCEEDED', url: data.message }
};

const requestDogError = () => {
    return { type: 'REQUESTED_DOG_FAILED' }
};

export { fetchDog, requestDog, requestDogSuccess, requestDogError };
