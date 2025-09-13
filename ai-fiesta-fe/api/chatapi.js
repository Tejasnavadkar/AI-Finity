///api/chatApi.js
// Use the full backend URL. For development, this is typically localhost.
// Make sure to replace this with your production URL when you deploy.
// const BASE_URL = 'http://localhost:8080'; // process.env.NEXT_BASE_URL

/**
* Makes an API call to the backend chat service.
* @param {string} model - The model to call (e.g., 'gemini', 'gpt', 'llama').
* @param {Array<object>} history The chat history array.
* @returns {Promise<string>} The text response from the model.
*/

export const callAiModel = async (model,history) => { // model eg: openai/gemini/Llama
    // console.log("base-url-",process.env.NEXT_PUBLIC_BASE_URL)
        try {
            const response = await fetch( `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/${model}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ history }),
            });
        
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || `API call failed with status ${response.status}`)
            }
            return await response.json()
        
        } catch (error) {
             console.log(`error while calling apis from FE--, ${error.message}`)
             throw new Error(error.message)
        }
}

