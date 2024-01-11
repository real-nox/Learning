import { config } from 'dotenv';
config();
//Role
export const rolepermited = "K_NextMod"

//Owners
export const Ranox = process.env.RANOX;
export const Emitter = process.env.EMITTER;
//Kai Server
export const SecretAdmins = process.env.KAISecretAdmins
export const Admins = process.env.KAIAdmin
export const JRA = process.env.KAIJRAdmin
export const StarMOD = process.env.KAIStartmod
export const EventManagers = process.env.KAIEventManager
export const EventStaff = process.env.KAIEventStaff
//Database
export const DEventManager = process.env.DEventManager;
export const DEventStaff = process.env.DEventStaff;
//test Server
export const Host = process.env.HOST;
//Test in Staff Server

export const normalroles = [DEventStaff, Host, DEventManager, EventStaff, EventManagers, StarMOD, JRA, Admins, SecretAdmins];
export const superiorsroles = [Host, DEventManager, EventManagers, StarMOD, JRA, Admins, SecretAdmins]
