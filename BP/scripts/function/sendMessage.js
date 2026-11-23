import { world, system } from '@minecraft/server';

export function sendMessage(translate, { withs = [], name } = {}) {

    system.run(() => { 

        let withss = []

        for (const one of withs) { withss.push(String(one)) }

        const message = { translate, with: withss }

        if (name === undefined) {

            world.sendMessage(message);

        } else {

            const player = world.getPlayers().find((p) => p.name === name)
            if (player) player.sendMessage(message);
        }
    })
} 