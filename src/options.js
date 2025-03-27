document.addEventListener('DOMContentLoaded', () => {
    const documentBinding = new ViewBinding(document);

    documentBinding.exportButton.addEventListener('click', () => {
        exportCommands();
    });
    documentBinding.importButton.addEventListener('click', () => {
        documentBinding.fileInput.click();
    });
    documentBinding.fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                importCommands(e.target.result);
            } catch (error) {
                showStatus(`インポートに失敗しました: ${error.message}`, 'error');
            }
        };
        reader.onerror = () => {
            showStatus('ファイルの読み込みに失敗しました。', 'error');
        };
        reader.readAsText(file);
        documentBinding.fileInput.value = '';
    });

    let timeoutId;
    const showStatus = (message, status) => {
        clearTimeout(timeoutId);
        documentBinding.statusMessage.textContent = message;
        documentBinding.statusMessage.dataset.status = status;

        timeoutId = setTimeout(() => {
            delete documentBinding.statusMessage.dataset.status;
        }, 3000);
    };


    const exportCommands = () => {
        StorageService.getCommands().then(commands => {
            const timestamp = new Date().toISOString();
            const exportObject = {
                version: '1.0',
                timestamp,
                commands: commands,
            };
            const jsonData = JSON.stringify(exportObject);
            const blob = new Blob([jsonData], { type: 'application/json' });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `omni-action-commands-${timestamp}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showStatus('コマンドをエクスポートしました。', 'success');
        });
    };

    const importCommands = (fileData) => {
        const importedData = JSON.parse(fileData);
        const commandCount = Object.keys(importedData.commands).length;

        const confirmMerge = confirm(
            `${commandCount}個のコマンドをインポートします。\n`
            + '重複した既存のコマンドは削除され、インポートしたコマンドに置き換えられます。'
        );
        if (!confirmMerge) {
            showStatus('インポートをキャンセルしました。', 'info');
            return;
        }

        StorageService.getCommands().then(existingCommands => {
            const mergedCommands = { ...existingCommands };

            let newCount = 0;
            let overwrittenCount = 0;
            for (const command in importedData.commands) {
                if (mergedCommands[command]) {
                    overwrittenCount++;
                } else {
                    newCount++;
                }
                mergedCommands[command] = importedData.commands[command];
            }

            return StorageService.setCommands(mergedCommands).then(() => {
                showStatus(
                    `コマンドをインポートしました。新規: ${newCount}個、上書き: ${overwrittenCount}個`,
                    'success',
                );
            });
        });
    };
});
