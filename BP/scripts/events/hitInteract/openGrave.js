import { world, BlockVolume, ItemStack, ItemTypes } from '@minecraft/server';
import { sendMessage } from '../../function/sendMessage';

export function openGrave(grave, player) {

    const graveInv = grave.getComponent('inventory').container;
    const playerInv = player.getComponent('inventory').container;

    const { x, y, z } = grave.location
    const dimension = grave.dimension

    let lostItems = {}, lostXP = 0

    const fromTo = new BlockVolume(
        { x: (x + 2), y, z: (z + 2) },
        { x: (x - 2), y: (y - 2), z: (z - 2) }
    )

    dimension.fillBlocks(fromTo, 'minecraft:frosted_ice', { blockFilter: { includeTypes: ['minecraft:ice'] }, ignoreChunkBoundErrors: true })

    if (Math.random() * 100 <= 10) {

        const player_head = new ItemStack('minecraft:player_head', 1)
        player_head.setLore([`§r§3Dimension: §6${dimension.id.replace('minecraft:', '')}\n§cX: ${Math.floor(x)}, Y: ${Math.floor(y)}, Z: ${Math.floor(z)}\n\n§cThis block cannot be placed`])
        player_head.nameTag = `§r§eHead: §6${grave.getDynamicProperty('name')}`

        dimension.spawnItem(player_head, { x, y, z });
    }

    for (let slot = 0; slot <= 44; slot++) {

        const graveSlot = graveInv.getItem(slot)
        const amount = lostItems[graveSlot?.typeId] ?? 0

        if (graveSlot?.typeId == 'grave:xp_bottle') {

            const xp = graveSlot?.getDynamicProperty('totalXp') ?? 0

            player.addExperience(xp);
            graveInv.setItem(slot);
            lostXP += xp

        } else if (slot <= 35 && !playerInv?.getItem(slot) && graveSlot?.typeId) {

            lostItems[graveSlot.typeId] = amount + graveSlot.amount

            playerInv.setItem(slot, graveSlot);
            graveInv.setItem(slot);
        }
    }

    function setArmor(type, slot) {

        const playerArmor = player.getComponent('equippable');
        const graveSlot = graveInv.getItem(slot)
        const amount = lostItems[graveSlot?.typeId] ?? 0

        if (!playerArmor.getEquipment(type)) {

            playerArmor.setEquipment(type, graveSlot);

            if (playerArmor.getEquipment(type)) {

                lostItems[graveSlot.typeId] = amount + graveSlot.amount
                graveInv.setItem(slot);
            }
        }
    }

    setArmor('Head', 36);
    setArmor('Chest', 37);
    setArmor('Legs', 38);
    setArmor('Feet', 39);
    setArmor('Offhand', 40);

    if (world.getPackSettings()['grave:chatFeedback']) {

        Object.entries(lostItems).map(([item, amount]) => {

            const itemName = ItemTypes.get(item).localizationKey

            player.sendMessage({ rawtext: [{ translate: 'grave.openGrave.amount', with: [`${amount}`] }, { translate: itemName }] })
        })

        sendMessage('grave.openGrave.amountXP', { name: player.name, withs: [lostXP] })
    }

    player.playSound('random.pop');
    grave.triggerEvent('grave_stone:open');
}