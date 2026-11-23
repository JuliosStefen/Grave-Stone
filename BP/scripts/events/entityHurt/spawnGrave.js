import { BlockVolume, ItemStack, world } from '@minecraft/server';
import { inventory, totalXp } from './saveInv';
import { clearPlayer } from '../../function/clearPlayer';
import { graveSave } from '../../function/graveSave';
import { antiSpam } from '../../function/antiSpam';

export function spawnGrave(player, { x, y, z }) {

    if (antiSpam(`Grave:${player.id}`, 1000)) return;

    const playerName = player.name
    const playerSave = graveSave().player[playerName] = {}
    const inv = player.getComponent('inventory').container;
    const equ = player.getComponent('equippable');

    const dimension = player.dimension

    const fromTo = new BlockVolume(
        { x: (x + 2), y: (y - 1), z: (z + 2) },
        { x: (x - 2), y: (y - 2), z: (z - 2) }
    )

    clearPlayer(player);

    dimension.fillBlocks(fromTo, 'minecraft:ice', { blockFilter: { includeTypes: ['minecraft:water', 'minecraft:flowing_water'] }, ignoreChunkBoundErrors: true })
    dimension.fillBlocks(fromTo, 'minecraft:magma', { blockFilter: { includeTypes: ['minecraft:lava', 'minecraft:flowing_lava'] }, ignoreChunkBoundErrors: true })

    // if (dimension.getBlock({ x, y: (y - 1), z }).typeId == 'minecraft:air') dimension.fillBlocks(fromTo, 'minecraft:coarse_dirt', { blockFilter: { includeTypes: ['minecraft:air'] }, ignoreChunkBoundErrors: true })
    if (dimension.getBlock({ x, y: (y - 1), z }).typeId == 'minecraft:air') dimension.runCommand(`fill ${x + 2} ${y - 1} ${z + 2} ${x - 2} ${y - 2} ${z - 2} coarse_dirt keep`);

    // I have no idea why, but when you do this via a script, the blocks in the End only loads halfway. It’s annoying, but this is the temporary solution.

    const grave = dimension.spawnEntity('grave:grave_stone', { x, y, z });

    playerSave.dimension = dimension.id
    playerSave.location = { x: (x - 0.5), y, z: (z - 0.5) }

    grave.setDynamicProperty('name', playerName)
    grave.nameTag = `§6Grave of§r\n${playerName}`;

    const itemSlot = []

    const arryInv = inventory[playerName].map((value, index) => ({ value, index })).filter(item => { return item.value !== null })
    const itemPercent = arryInv.length * world.getPackSettings()['grave:lostItems'] / 100

    while (itemSlot.length < itemPercent) {

        const random = Math.floor(Math.random() * arryInv.length)
        const item = arryInv[random].index

        if (!itemSlot.includes(item)) itemSlot.push(item);
    }

    const graveXp = totalXp[playerName] * world.getPackSettings()['grave:lostLevels'] / 100
    const playerXP = totalXp[playerName] - graveXp

    const xp_bottle = new ItemStack('grave:xp_bottle');

    xp_bottle.nameTag = `§l§6xp (${graveXp})§r`
    xp_bottle.setDynamicProperty('totalXp', graveXp)

    grave.getComponent('inventory').container.setItem(44, xp_bottle);
    player.addExperience(playerXP);

    playerSave.xp = graveXp

    let lostItems = playerSave.lostItems = {}

    inventory[playerName].map((item, s) => {

        if (player?.id == undefined || itemSlot.includes(s)) {

            const amount = lostItems[item.typeId] ?? 0

            grave.getComponent('inventory').container.setItem(s, item);
            lostItems[item.typeId] = amount + item.amount

        } else {

            if (s <= 35) {

                inv.setItem(s, item);

            } else {

                function clearSlot(slot) { equ.setEquipment(slot, item); }

                if (s == 36) clearSlot('Head');
                if (s == 37) clearSlot('Chest');
                if (s == 38) clearSlot('Legs');
                if (s == 39) clearSlot('Feet');
                if (s == 40) clearSlot('Offhand');
            }
        }
    })
}