import { colors } from "../../game/resources/colors.js";

export default class Games {
  constructor() {
    this.games = new Map();
  }

  create(user) {
    if (this.getUserCurrentGame(user)) {
      return null;
    }
    const game = new Game(this.#makeId(), user);
    this.games.set(game.id, game);
    return game;
  }

  #makeId() {
    return Date.now() + '.-.' + Math.random();
  }

  getAcceptableGames() {
    const res = [];
    for (const game of this.games.values()) {
      if (game.u2 === null && game.isActive) {
        res.push(game.toPublic());
      }
    }
    return res;
  }

  getUserCurrentGame(user) {
    for (const game of this.games.values()) {
      if ((game.u1 === user || game.u2 === user) && game.isActive) {
        return game;
      }
    }
    return null;
  }
}

class Game {
  constructor(id, user) {
    this.id = id;
    this.u1 = user;
    this.u2 = null;
    this.isActive = true;
    this.movePlayer = colors.WHITE;
  }

  toPublic() {
    return {
      id: this.id,
      u1: this.u1.name,
      u2: this.u2 === null ? null : this.u2.name,
      u1Color: this.u1Color,
      u2Color: this.u2Color,
      movePlayer: this.movePlayer
    };
  }
}