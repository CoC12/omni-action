importScripts('services/storage_service.js');


const DEFAULT_COMMAND = {
    actionType: 'google',
};

const actionFuncMapping = {
    google: (command, args, config) => {
        const query = [command, ...args].join(' ');
        const url = `https://google.com/search?q=${encodeURIComponent(query)}`;
        chrome.tabs.create({ url });
    },
    navigate: (command, args, config) => {
        let url = config.url;
        if (args.length > 0) {
            url = url.replace('%s', encodeURIComponent(args.join(' ')));
         }
         chrome.tabs.create({ url });
    },
};


chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    const input = text.trim().toLowerCase();
    if (!input) {
        return;
    }

    StorageService.getCommands().then(commands => {
        const suggestions = [];
        for (const command in commands) {
            if (command.toLowerCase().includes(input)) {
                const action = commands[command];
                suggestions.push({
                    content: command,
                    description: `<match>${command}</match>: ${action.actionType}`,
                });
            }
        }
        suggest(suggestions);
    });
});


chrome.omnibox.onInputEntered.addListener((text) => {
    const [command, ...args] = text.trim().split(' ');

    StorageService.getCommand(command).then((action) => {
        const actionFunc = actionFuncMapping[action.actionType || 'google'];
        actionFunc(command, args, action);
    });
});
