import { openGrave } from './hitInteract/openGrave';
import { world } from '@minecraft/server';

world.afterEvents.entityContainerClosed.subscribe(({ entity, closeSource }) => {

    if (entity.typeId == 'grave:grave_stone' && world.getPackSettings()['grave:removeEmptyGraves']) {

        const graveInv = entity.getComponent('inventory').container
        if (graveInv?.emptySlotsCount >= 45) openGrave(entity, closeSource.entity);
    }
})