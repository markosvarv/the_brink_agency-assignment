import * as migration_20260907_202203_init from './20260907_202203_init';
import * as migration_20260909_183939_add_articles_and_contact from './20260909_183939_add_articles_and_contact';
import * as migration_20260910_000000_add_users_sessions from './20260910_000000_add_users_sessions';

export const migrations = [
  {
    up: migration_20260907_202203_init.up,
    down: migration_20260907_202203_init.down,
    name: '20260907_202203_init',
  },
  {
    up: migration_20260909_183939_add_articles_and_contact.up,
    down: migration_20260909_183939_add_articles_and_contact.down,
    name: '20260909_183939_add_articles_and_contact',
  },
  {
    up: migration_20260910_000000_add_users_sessions.up,
    down: migration_20260910_000000_add_users_sessions.down,
    name: '20260910_000000_add_users_sessions',
  },
];

