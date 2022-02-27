export type Arguments = {
  dbName: string;
  frequency?: string;
  nbSaved?: number;
  host?: string;
  port?: string;
  outPath?: string;
  withStdout?: boolean;
  withStderr?: boolean;
  withClose?: boolean;
};
