document.addEventListener('DOMContentLoaded', () => {
    const documentBinding = new ViewBinding(document);

    const commandsListManager = new CommandsListManager(documentBinding.commandsList);
    const commandFormManager = new CommandFormManager(documentBinding.commandFormContainer);
    commandsListManager.setEditCallback((command, action) => {
        commandFormManager.setModeEdit(command, action);
    });
    commandsListManager.setDeleteCallback((command) => {
        const result = confirm(`コマンド "${command}" を削除しますか？`);
        if (!result) {
            return;
        }

        StorageService.deleteCommand(command).then(() => {
            commandsListManager.update();
            commandFormManager.setModeAdd();
        });
    });
    commandFormManager.setSaveCallback(() => {
        commandsListManager.update();
    });

    documentBinding.settingsButton.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.runtime.openOptionsPage();
    });
});
