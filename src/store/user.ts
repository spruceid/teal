import { AppBskyActorDefs } from '@atproto/api';
import { atom } from 'jotai';

export const userAtom = atom<AppBskyActorDefs.ProfileView | null>(null);