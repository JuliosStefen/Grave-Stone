import { teleportPlayer, teleports } from './teleport';
import { world, system } from '@minecraft/server';
import { sendMessage } from '../../function/sendMessage';

world.afterEvents.itemUse.subscribe(({ source, itemStack }) => system.run(() => {

    if (source.typeId === 'minecraft:player' && itemStack.typeId === 'grave:map') {

        const mapSave = JSON.parse(itemStack?.getDynamicProperty('mapSave') ?? '{}');

        if (mapSave?.location && mapSave?.dimension) {

            if (world.getPackSettings()['grave:allowTeleporting']) {

                if (!teleports[source.name]) teleportPlayer(source);

            } else {

                const { x, y, z } = mapSave.location
                const dimension = mapSave.dimension.replace('minecraft:', '');

                sendMessage('grave.itemUse.graveLocation', { withs: [dimension, x, y, z], name: source.name })
            }
        }
    }
}))