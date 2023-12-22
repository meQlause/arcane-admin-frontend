export enum RoleType {
  Admin = 'admin',
  Member = 'member',
  Unregistered = 'unregistered',
}

export type NFTauth = {
  address: string;
  role: RoleType;
  access_token: string;
}