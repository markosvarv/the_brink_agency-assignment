import * as migration_20260907_202203_init from './20260907_202203_init';

export const migrations = [
  {
    up: migration_20260907_202203_init.up,
    down: migration_20260907_202203_init.down,
    name: '20260907_202203_init'
  },
];
