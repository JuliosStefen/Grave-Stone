import { system, world } from '@minecraft/server';
import { openGrave } from './openGrave';

world.afterEvents.entityHitEntity.subscribe(({ damagingEntity, hitEntity }) => {

    if (hitEntity.typeId == 'grave:grave_stone' && damagingEntity.typeId == 'minecraft:player') {

        const display = damagingEntity.onScreenDisplay;

        if (world.getPackSettings()['grave:privateGraves'] && damagingEntity.name !== hitEntity.getDynamicProperty('name')) {

            if (world.getPackSettings()['grave:ignoreOPplayers'] && damagingEntity.playerPermissionLevel >= 2) { }

            else {

                display.setActionBar({ translate: 'grave.hitInteract.cantOpen' })
                return;
            }
        }

        if (!damagingEntity.isSneaking) display.setActionBar({ translate: 'grave.hitInteract.quickloot' });

        if (damagingEntity.isSneaking) {

            system.run(() => { openGrave(hitEntity, damagingEntity) })
        }
    }
});

world.beforeEvents.playerInteractWithEntity.subscribe((event) => {

    const { player, target } = event
    const display = player.onScreenDisplay;

    if (target.typeId === 'grave:grave_stone' && player.typeId === 'minecraft:player') {

        if (world.getPackSettings()['grave:ignoreOPplayers'] && player.playerPermissionLevel >= 2) { }

        else {

            system.run(() => display.setActionBar({ translate: 'grave.hitInteract.cantOpen' }))
            event.cancel = true;
            return;
        }

        if (player.isSneaking) {

            system.run(() => { openGrave(target, player) })
            event.cancel = true;
        }
    }
})