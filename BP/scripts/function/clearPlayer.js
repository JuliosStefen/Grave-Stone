export function clearPlayer(player) {

    player.resetLevel();

    const inv = player.getComponent('inventory').container;
    const equ = player.getComponent('equippable');

    for (let s = 0; s <= 40; s++) {

        if (s <= 35) {

            inv.setItem(s, null);

        } else {

            function clearSlot(slot) { equ.setEquipment(slot, null); }

            if (s == 36) clearSlot('Head');
            if (s == 37) clearSlot('Chest');
            if (s == 38) clearSlot('Legs');
            if (s == 39) clearSlot('Feet');
            if (s == 40) clearSlot('Offhand');
        }
    }
}