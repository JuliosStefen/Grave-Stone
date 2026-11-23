import { world } from '@minecraft/server';

world.afterEvents.playerInventoryItemChange.subscribe(({ player, itemStack, slot }) => {

    const playerInv = player.getComponent('inventory').container

    if (itemStack?.typeId == 'grave:xp_bottle') {

        player.addExperience(itemStack?.getDynamicProperty('totalXp') ?? 0);
        playerInv.setItem(slot);
    }
})