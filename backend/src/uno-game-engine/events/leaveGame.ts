import { assert } from 'console';
import { GameEngine } from '../engine';
import { EventResult, GameEvent } from '../../types';
import { getPlayer } from './eventHandlerUtils';
import { User } from '../../models/userModel';

export function leaveGame(game: GameEngine, event: GameEvent): EventResult {
    assert(event.type === 'LEAVE_GAME', 'Invalid event type');
    const player = getPlayer(game, event.playerId);
    if (!player) {
        return { type: 'ERROR', message: 'Player not found' };
    }
    game.removePlayer(player);
    const user = User.findById(event.playerId);
    user.findByIdAndUpdate(event.playerId, { activeGameId: null });
    return { type: 'SUCCESS', message: 'player left successfully' };
}
