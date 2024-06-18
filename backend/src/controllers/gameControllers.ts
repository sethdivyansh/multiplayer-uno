import { Response } from 'express';
import { enqueueForSend } from '../eventRecipients';
import { AuthRequest } from '../middlewares/authMiddleware';
import { createGame, retrieveGame } from '../gameStore';
import { GameEngine } from '../uno-game-engine/engine';

export async function handleGameEvent(req: AuthRequest, res: Response) {
    const event = req.body;
    const activeGameId = req.user.activeGameId;
    if (!activeGameId) {
        res.status(404).send({
            message: 'User is not actively playing any game',
        });
        return;
    }
    const game = retrieveGame(activeGameId);
    if (!game) {
        res.status(404).send({ message: 'Game not found' });
        return;
    }
    //todo: When game data is retrieved from database, it is not an instance of GameEngine
    // so we would need to convert it to an instance of GameEngine
    const result = game.dispatchEvent(event);
    if (result.type === 'ERROR') {
        res.status(400).send({ message: result.message });
        return;
    } else {
        propagateChanges(game);
        res.status(200).send({ message: 'Event propagated to clients.' });
    }
}

export async function handleGameJoin(req: AuthRequest, res: Response) {
    const gameCode = req.body.code;
    const activeGameId = req.user.activeGameId;
    if (activeGameId) {
        res.status(400).send({
            error: 'User is already playing a game',
        });
        return;
    }
    const game = retrieveGame(gameCode);
    if (!game) {
        res.status(404).send({ error: 'Game not found' });
        return;
    }
    //note: when retrieving game from database, it is not an instance of GameEngine
    // we'd need to add these functions to the mongodb game schema
    game.dispatchEvent({ type: 'JOIN_GAME', playerId: req.user.id });
    propagateChanges(game);
    req.user.activeGameId = gameCode;
    await req.user.save();
    res.status(200).send({
        message: 'Game joined successfully',
        gameState: game,
    });
}

export async function handleGameCreate(req: AuthRequest, res: Response) {
    const game = createGame();
    const eventResult = game.dispatchEvent({
        type: 'JOIN_GAME',
        playerId: req.user.id,
    });
    if (eventResult.type === 'ERROR') {
        res.status(500).send({ error: 'Failed to create game' });
        return;
    }
    req.user.activeGameId = game.id;
    await req.user.save();
    res.status(200).send({
        message: 'Game created successfully',
        gameState: game,
    });
}

// temporarily here
function propagateChanges(game: GameEngine) {
    // the game state after a successful event is propagated to all clients
    // we can choose to relay the event received, so that the clients apply the event
    // to their local game state, but that would be an extra implementation burden.
    // Instead, we can just send the new game state to the clients.
    for (const player of game.players) {
        enqueueForSend(player.id, game);
    }
}
