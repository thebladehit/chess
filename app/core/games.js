export default class Games {
  constructor() {
    this.games = new Map();
  }

  create(user) {
    if (this.#userInActiveGame(user)) {
      return null;
    }
    const game = new Game(this.#makeId(), user);
    this.games.set(game.id, game);
    return game;
  }

  #makeId() {
    return Date.now() + '.-.' + Math.random();
  }

  #userInActiveGame(user) {
    for (const game of this.games.values()) {
      if ((game.u1 === user || game.u2 === user) && game.isActive) {
        return true;
      }
    }
    return false;
  }
}

class Game {
  constructor(id, user) {
    this.id = id;
    this.u1 = user;
    this.u2 = null;
    this.isActive = true;
    this.moves = [];
  }

  toPublic() {
    return {
      id: this.id,
      u1: this.u1.name,
      u2: this.u2 === null ? null : this.u2.name,
    };
  }
}