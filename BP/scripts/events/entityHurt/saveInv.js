export let inventory = {}, totalXp = {}

export function saveInv(player) {

    const inv = player.getComponent('inventory').container;
    const equ = player.getComponent('equippable');

    inventory[player.name] = []
    totalXp[player.name] = player.getTotalXp();

    for (let s = 0; s <= 35; s++) inventory[player.name].push(inv?.getItem(s) ?? null)

    function pushSlot(slot) { inventory[player.name].push(equ?.getEquipment(slot) ?? null) }

    pushSlot('Head');
    pushSlot('Chest');
    pushSlot('Legs');
    pushSlot('Feet');
    pushSlot('Offhand');
}