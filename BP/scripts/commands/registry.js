import { settings } from './settings';
import { system } from '@minecraft/server';

system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {

    customCommandRegistry.registerCommand({
        name: 'grave:settings',
        description: 'grave.command.settings.description',
        permissionLevel: 1
    }, settings)
})