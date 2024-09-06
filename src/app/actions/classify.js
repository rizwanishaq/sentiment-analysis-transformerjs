'use server';
import PipelineSingleton from './pipeline.js';

/**
 * Classify text using a pre-loaded classifier from the PipelineSingleton.
 * 
 * @async
 * @function classify
 * @param {string} text - The input text to be classified.
 * @returns {Promise<Object>} A promise that resolves to an object containing 
 * either the classification result or an error message.
 * 
 * @example
 * const response = await classify("Sample text");
 * if (response.error) {
 *     console.error(response.error);
 * } else {
 *     console.log(response.result);
 * }
 */
export const classify = async (text) => {
    try {
        // Get an instance of the classifier from the PipelineSingleton
        const classifier = await PipelineSingleton.getInstance();

        // Perform classification on the provided text
        const result = await classifier(text);

        // Return the classification result
        return { result };
    } catch (error) {
        // Handle errors by returning the error message
        return { error: error.message || error };
    }
};
