export const getDataFromLocalStorage = async (key) => {
    return JSON.parse(localStorage.getItem(key));
}

export const putDataToLocalStorage = async (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}


export const getOneData = async (key, value) => {
    const data = await getDataFromLocalStorage(key);
    return data.find(({ id }) => id === value);
}

export const updateData = async (key, value) => {
    const data = await getDataFromLocalStorage(key);
    const uData = data.map((item) => {
        if (item.id === value.id) {
            item = value;
        }
        return item;
    })
    await putDataToLocalStorage(key, uData);
}

