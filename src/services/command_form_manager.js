class CommandFormManager {

    /**
     * Creates a new instance of CommandFormManager.
     *
     * @param {Element} containerElement - The container element for the command form.
     */
    constructor(containerElement) {
        this.containerBinding = new ViewBinding(containerElement);
        this.commandForm = this.containerBinding.commandForm;
        this.commandForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCommand();
        });
        this.containerBinding.cancelButton.addEventListener('click', () => {
            this.setModeAdd();
        });
        this.saveCallback = () => {};

        this.setModeAdd();
    }

    /**
     * Sets the command form to "Add" mode.
     */
    setModeAdd() {
        this.commandForm.originalCommand.value = '';
        this.commandForm.reset();

        this.containerBinding.formTitle.textContent = '新しいコマンドを追加';
        this.containerBinding.cancelButton.style.display = 'none';
        this.containerBinding.cancelButton.textContent = '戻る';
        this.containerBinding.saveButton.textContent = '保存';
    }

    /**
     * Sets the command form to "Edit" mode.
     */
    setModeEdit(command, action) {
        this.commandForm.originalCommand.value = command;
        this.commandForm.command.value = command;
        this.commandForm.actionType.value = action.actionType;
        switch (action.actionType) {
            case 'navigate':
                this.commandForm.navigateUrl.value = action.url;
                break;
        }

        this.containerBinding.formTitle.textContent = 'コマンドを編集';
        this.containerBinding.cancelButton.style.display = 'block';
        this.containerBinding.saveButton.textContent = '更新';
        this.commandForm.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Validates the command form input and prepares action details.
     *
     * @returns {Object} An object containing the validated command and action details.
     * @throws {Error} If the input is invalid.
     */
    validate() {
        const command = this.commandForm.command.value.trim();
        const actionType = this.commandForm.actionType.value;
        const actionDetails = { actionType };

        if (!command) {
            throw new Error('コマンドを入力してください');
        }

        if (!/^[A-Za-z]+$/.test(command)) {
            throw new Error('コマンドは英字のみ使用できます');
        }

        switch (actionType) {
            case 'navigate':
                const url = this.commandForm.navigateUrl.value.trim();
                if (!url) {
                    throw new Error('URLを入力してください');
                }
                actionDetails.url = url;
                break;
        }

        return {command, actionDetails};
    }

    /**
     * Saves the command after validation.
     * @returns {Promise<void>} A promise that resolves when the command is saved successfully.
     * @throws {Error} Throws an error if validation fails.
     */
    async saveCommand() {
        let result;
        try {
            result = this.validate();
        } catch (error) {
            alert(error.message);
            return;
        }

        const originalCommand = this.commandForm.originalCommand.value;
        if (originalCommand) {
            await StorageService.deleteCommand(originalCommand);
        }
        StorageService.setCommand(result.command, result.actionDetails).then(() => {
            this.setModeAdd();
            this.saveCallback();
        });
    }

    /**
     * Sets a callback function to be executed after a command is successfully saved.
     *
     * @param {Function} callback - The function to be called after a successful save operation.
     */
    setSaveCallback(callback) {
        this.saveCallback = callback;
    }
}
