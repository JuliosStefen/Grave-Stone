import { sendMessage } from '../function/sendMessage';
import { world, system } from '@minecraft/server';

export function settings(senders) {

    system.run(() => {

        const sender = senders.sourceEntity

        if (sender.typeId === 'minecraft:player') {

            const packSettings = Object.entries(world.getPackSettings())
            const settings = packSettings.filter(([rule]) => rule.startsWith('grave:'))

            sendMessage(`grave.settings.line1`, { name: sender.name })
            settings.forEach(([rule, setting]) => sendMessage(`grave.settings.${rule}`, { withs: [setting], name: sender.name }))
            sendMessage(`grave.settings.line2`, { name: sender.name })

            sender.playSound('random.pop');
        }
    })
}