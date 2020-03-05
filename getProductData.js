import axios from 'axios'

export default async (url, params) => {
  try {
    const { data } = await axios.get(url, params)
      .then(data => data)
      .catch(err => err)
    return data
  } catch (error) {
    throw new Error(error)
  }
}
