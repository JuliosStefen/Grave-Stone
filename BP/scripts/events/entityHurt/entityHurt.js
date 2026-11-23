import { correctUp, correctDown } from './correctPos';
import { world, system } from '@minecraft/server';
import { spawnGrave } from './spawnGrave';
import { blockDrops } from '../entitySpawn';
import { saveInv } from './saveInv';

world.beforeEvents.entityHurt.subscribe(({ hurtEntity }) => {

    if (hurtEntity.typeId == 'minecraft:player') {

        const health = hurtEntity.getComponent('health').currentValue;
        const equ = hurtEntity.getComponent('equippable');

        if (health <= 0 && (equ.getEquipment('Offhand')?.typeId !== 'minecraft:totem_of_undying' && equ.getEquipment('Mainhand')?.typeId !== 'minecraft:totem_of_undying')) {

            blockDrops(hurtEntity);
            saveInv(hurtEntity);
        }
    }
})

world.afterEvents.entityHurt.subscribe(({ hurtEntity, cause }) => system.run(() => {

    if (hurtEntity?.typeId == 'minecraft:player') {

        const x = Math.floor(hurtEntity.location.x) + 0.5
        let y = Math.floor(hurtEntity.location.y)
        const z = Math.floor(hurtEntity.location.z) + 0.5

        const health = hurtEntity.getComponent('health').currentValue
        const equ = hurtEntity.getComponent('equippable')

        const dim = hurtEntity.dimension

        if (health <= 0 &&
            (
                (cause === 'selfDestruct' || cause === 'void') ||
                (equ.getEquipment('Offhand')?.typeId !== 'minecraft:totem_of_undying' && equ.getEquipment('Mainhand')?.typeId !== 'minecraft:totem_of_undying')
            )
        ) {

            if (y > dim.heightRange.max) y = dim.heightRange.max
            if (y < dim.heightRange.min) y = dim.heightRange.min

            const blockId = dim.getBlock({ x, y, z }).typeId

            if (blockId == 'minecraft:air') {

                if (correctDown(hurtEntity, dim, { x, y, z })) return;
                if (correctUp(hurtEntity, dim, { x, y, z })) return;

            } else if (blockId !== 'minecraft:air') {

                if (correctUp(hurtEntity, dim, { x, y, z })) return;
                if (correctDown(hurtEntity, dim, { x, y, z })) return;
            }

            spawnGrave(hurtEntity, { x, y: (y + 2), z })
        }
    }
}))