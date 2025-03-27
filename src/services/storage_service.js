class StorageService {

    /**
     * Retrieves all commands from Chrome storage.
     *
     * @returns {Promise<Object>} A promise that resolves to an object containing all stored commands.
     */
    static async getCommands() {
        return chrome.storage.sync.get('commands').then(data => data.commands || {});
    }

    /**
     * Saves the provided commands to Chrome storage.
     *
     * @param {Object} commands - An object containing all commands to be stored.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
    static setCommands(commands) {
        return chrome.storage.sync.set({commands});
    }

    /**
     * Retrieves a specific command from Chrome storage based on the provided key.
     *
     * @param {string} key - The command name to retrieve.
     * @returns {Promise<Object>} A promise that resolves to the command object.
     */
    static async getCommand(key) {
        return StorageService.getCommands().then(commands => commands[key] || {});
    }

    /**
     * Saves the provided command to Chrome storage.
     *
     * @param {string} key - The command name to be stored.
     * @param {Object} action - The action object representing the command to be stored.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
    static async setCommand(key, action) {
        return StorageService.getCommands().then(commands => {
            commands[key] = action;
            return StorageService.setCommands(commands);
        });
    }

    /**
     * Deletes a specific command from Chrome storage.
     *
     * @param {string} key - The command name to be deleted.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
    static async deleteCommand(key) {
        return StorageService.getCommands().then(commands => {
            delete commands[key];
            return StorageService.setCommands(commands);
        });
    }
}
