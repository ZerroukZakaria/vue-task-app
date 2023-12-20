
export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
}

export const apiUrl = process.env.VUE_APP_API_URL;
export const authToken = process.env.VUE_APP_AUTH_TOKEN;