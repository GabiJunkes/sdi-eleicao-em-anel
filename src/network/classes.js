// Classes relacionadas a eleição
export class Election {
  constructor(ownerId, maxId, minId) {
    this.ownerId = ownerId;
    this.maxId = maxId;
    this.minId = minId;
  }
}

export class Elected {
  constructor(nodeId) {
    this.nodeId = nodeId;
  }
}

export function getMessageType(message) {
  if (message.hasOwnProperty('ownerId')) {
    return 'Election'
  } else if (message.hasOwnProperty('nodeId')) {
    return 'Elected'
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