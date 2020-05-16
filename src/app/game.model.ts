

export class Game {
    id?: string;
    state: string;
    name: string;
    numberOfTeams: number;
    namesPerPerson: number;
    ownerId: string;
    ownerName: string;
    currentRound: number;
    currentUserTurnId?: string;
    currentUserTurnName?: string;
    roundEnd?: number;
    roundLength: number;
    carryOverTime?: number;
}