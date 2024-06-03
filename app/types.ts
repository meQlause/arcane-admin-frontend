export enum RoleType {
  Admin = "admin",
  Member = "member",
  Unregistered = "unregistered",
}

export type NFTauth = {
  address: string;
  role: RoleType;
  access_token: string;
};

export type VaultResponse = {
  address: string;
  ancestor_identities: undefined;
  details: any;
  metadata: any;
  fungible_resources: {
    total_count: number;
    items: {
      aggregation_level: any;
      resource_address: string;
      vaults: {
        total_count: number;
        items: {
          vault_address: string;
          amount: number;
          last_updated_at_state_version: number;
        }[];
      };
    }[];
  };
  non_fungible_resources: {
    total_count: number;
    items: {
      aggregation_level: string;
      resource_address: string;
      vaults: {
        total_count: number;
        items: {
          total_count: number;
          items: string[];
          vault_address: string;
          last_updated_at_state_version: number;
        }[];
      };
    }[];
  };
};
