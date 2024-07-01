// Classes relacionadas a eleição
export class Election {
  constructor(ownerId, maxId) {
    this.type = "Election";
    this.ownerId = ownerId;
    this.maxId = maxId;
  }
}

export class Elected {
  constructor(ownerId, nodeId) {
    this.type = "Elected";
    this.ownerId = ownerId;
    this.nodeId = nodeId;
  }
}
// Classes relacionadas a multicast
export class Join {
  constructor(nodeId) {
    this.nodeId = nodeId;
  }
}

export class Welcome{
  constructor(minId, leaderId) {
    this.minId = minId;
    this.leaderId = leaderId;
  }
}