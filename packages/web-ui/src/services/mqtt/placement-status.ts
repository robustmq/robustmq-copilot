export interface LeaderId {
  term: number;
  node_id: number;
}

export interface LogId {
  leader_id: LeaderId;
  index: number;
}

export interface Node {
  node_id: number;
  rpc_addr: string;
}

export interface Membership {
  configs: number[][];
  nodes: {
    [key: string]: Node;
  };
}

export interface MembershipConfig {
  log_id: LogId;
  membership: Membership;
}

export interface RaftNodeState {
  running_state: string;
  id: number;
  current_term: number;
  vote: {
    leader_id: LeaderId;
    committed: boolean;
  };
  last_log_index: number;
  last_applied: LogId;
  snapshot: string;
  purged: string;
  state: string;
  current_leader: number;
  millis_since_quorum_ack: number;
  last_quorum_acked: number;
  membership_config: MembershipConfig;
  heartbeat: {
    [key: string]: number;
  };
  replication: {
    [key: string]: LogId;
  };
}
