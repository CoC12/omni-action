class CommandsListManager {

    /**
     * Creates a new instance of CommandsListManager.
     *
     * @param {Element} containerElement - The container element where the commands list will be displayed.
     */
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.editCallback = () => {};
        this.deleteCallback = () => {};

        this.emptyMessageTemplate = document.querySelector('#id-popup__commands-empty-template');
        this.itemTemplate = document.querySelector('#id-popup__commands-item-template');

        this.update();
    }

    /**
     * Displays an empty message in the container element when there are no commands to show.
     */
    showEmptyMessage() {
        const emptyMessage = this.emptyMessageTemplate.content.cloneNode(true);
        this.containerElement.appendChild(emptyMessage);
    }

    /**
     * Updates the commands list in the container element.
     */
    update() {
        this.containerElement.innerHTML = '';

        StorageService.getCommands().then(commands => {
            if (Object.keys(commands).length === 0) {
                this.showEmptyMessage();
                return;
            }

            for (const command in commands) {
                const action = commands[command];
                const item = this.itemTemplate.content.cloneNode(true);
                const itemBinding = new ViewBinding(item);

                itemBinding.commandName.textContent = command;
                itemBinding.commandDescription.textContent = action.actionType;
                itemBinding.commandItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.editCallback(command, action);
                });
                itemBinding.deleteButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteCallback(command);
                });
                this.containerElement.appendChild(item);
            }
        });
    }


    /**
     * Sets a callback function to be executed after a command is edited.
     *
     * @param {Function} callback - The function to be called after a command is edited.
     */
    setEditCallback(callback) {
        this.editCallback = callback;
    }

    /**
     * Sets a callback function to be executed after a command is deleted.
     *
     * @param {Function} callback - The function to be called after a command is deleted.
     */
    setDeleteCallback(callback) {
        this.deleteCallback = callback;
    }
}
