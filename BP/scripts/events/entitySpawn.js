import { world, system } from '@minecraft/server';

let dropLocation = {}

export function blockDrops(player) {

    const playerName = player.name

    dropLocation[playerName] = player.location
    system.runTimeout(() => delete dropLocation[playerName], 5)
}

world.afterEvents.entitySpawn.subscribe(({ entity }) => system.run(() => {

    if (entity.typeId == 'minecraft:item' || entity.typeId == 'minecraft:xp_orb') for (const name in dropLocation) {

        const { x, y, z } = entity.location
        const loc = dropLocation[name]

        if (
            x <= loc.x + 0.5 && x >= loc.x - 0.5 &&
            y <= loc.y + 2.0 && y >= loc.y - 1.0 &&
            z <= loc.z + 0.5 && z >= loc.z - 0.5
        ) entity.remove();
    }
}))