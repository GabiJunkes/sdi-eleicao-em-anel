// Classes relacionadas a eleição
class Election {
  constructor(ownerId, maxId, minId) {
    this.ownerId = ownerId;
    this.maxId = maxId;
    this.minId = minId;
  }
}

class Elected {
  constructor(nodeId) {
    this.nodeId = nodeId;
  }
}

// Classes relacionadas a multicast
class Join {
  constructor(nodeId) {
    this.nodeId = nodeId;
  }
}

class Welcome{
  constructor(minId, leaderId) {
    this.minId = minId;
    this.leaderId = leaderId;
  }
}