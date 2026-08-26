const { Plugin, Notice} = require('obsidian');

/** @extends Plugin */
module.exports = class JustFTablesPlugin extends Plugin {
    async onload() {
        console.log('JustFTables, trun on!');
        
        const style = document.createElement('style');
        style.id = 'justFStyle';
        style.innerHTML = `
            .justFMerged {
                background-color: var(--background-secondary);
            }
        `;
        document.head.appendChild(style);

        this.registerMarkdownPostProcessor((element, context) => {
            const tables = element.querySelectorAll('table');

            tables.forEach(table => {
                const rows = table.querySelectorAll('tr');

                rows.forEach(row => {
                    const cells = row.querySelectorAll('td, th');

                    cells.forEach((cell, index) => {
                        const text = (cell.textContent || '').trim();

                        const match = text.match(/^(->|-\/)(\d+)/);

                        if (match) {
                            const spanCount = parseInt(match[2], 10);

                            cell.textContent = text.slice(match[0].length).trim();
                            cell.classList.add('justFMerged');

                            if (match[1] === '->') { // for columns
                                cell.setAttribute('colspan', String(spanCount))
                                cell.setAttribute('text-align','center')

                                for (let i = 1; i < spanCount; i++) {
                                    const nextCell = cells[index + i];
                                    if (nextCell){
                                         nextCell.remove()
                                    }
                                }
                                cell.setAttribute('text-align','center')
                            } else {//for rows
                                cell.setAttribute('rowspan', String(spanCount));
                                cell.setAttribute('text-align','center')

                                for (let i = 1; i < spanCount; i++) {
                                    const nextRow = rows[Array.from(rows).indexOf(row) + i];
                                    const nextCell = nextRow?.cells[index];
                                    if (nextCell){
                                        nextCell.remove();
                                    } 
                                }
                            }
                        }
                    });
                });
            });
        });

        this.addCommand({
            id: 'ShowVersion',
            name: 'Show version',
            callback: () => new Notice('JustFTables version:'+this.manifest.version)
        });

        this.addCommand({
            id: 'AddTable',
            name: 'Add example fixed table',
            editorCallback: (editor,view)=>{
                const template =
                    '| Head 1           |   Head 2   | Head 3 |\n'+
                    '| ---------------- | :--------: | :----: |\n'+
                    '| Row 1            | ->2 Double |        |\n'+
                    '| -/2 Row 2 double |    Row     |  Row   |\n'+
                    '|                  |    Row     |  Row   |'
                editor.replaceSelection(template)
            }
        });
}

    onunload() {
        const style = document.getElementById('justFStyle');
        if (style){
            style.remove();
        }
        console.log('JustFTables, turn off!');
    }
};