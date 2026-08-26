const { Plugin, Notice, apiVersion, requireApiVersion } = require('obsidian');


/** @extends Plugin */
module.exports = class JustFTablesPlugin extends Plugin {
    async onload() {
        console.log('Wtyczka JustFTables załadowana!');
        
        this.addCommand({
            id: 'testowa-komenda',
            name: 'Show version',
            callback: () => new Notice('JustFTables version:'+this.manifest.version)
        });
    }

    onunload() {
        console.log('Wtyczka JustFTables wyłączona.');
    }
};