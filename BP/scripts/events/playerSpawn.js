import { world, ItemStack, ItemTypes } from '@minecraft/server';
import { sendMessage } from '../function/sendMessage';
import { graveSave } from '../function/graveSave';

world.afterEvents.playerSpawn.subscribe(({ player }) => {

    const playerSave = graveSave().player[player.name]

    if (playerSave) {

        const { x, y, z } = playerSave.location
        const dimension = playerSave.dimension
        const equ = player.getComponent('equippable')

        const graveMap = new ItemStack('grave:map');

        graveMap.nameTag = `§r§6Grave of§r ${player.name}`;
        graveMap.setDynamicProperty('mapSave', JSON.stringify({ dimension, location: { x, y, z } }));
        graveMap.setLore([`§r§3Dimension: §6${dimension.replace('minecraft:', '')}\n§cX: ${x}, Y: ${y}, Z: ${z}`])

        if (world.getPackSettings()['grave:chatFeedback']) {

            sendMessage('grave.playerSpawn.amountXP', { name: player.name, withs: [playerSave.xp] })

            Object.entries(playerSave.lostItems).map(([item, amount]) => {

                const itemName = ItemTypes.get(item).localizationKey

                player.sendMessage({ rawtext: [{ translate: 'grave.playerSpawn.amount', with: [`${amount}`] }, { translate: itemName }] })
            })
        }

        if (!equ?.getEquipment('Mainhand')) {

            equ.setEquipment('Mainhand', graveMap);

        } else {

            const { x, y, z } = player.location

            player.dimension.spawnItem(graveMap, { x, y, z })
        }

        delete graveSave().player[player.name]
    }
})