import {RegistryBox} from './registry-box.js';
export const seedUsers=[
 {id:'USR-ADMIN',username:'admin',displayName:'System Admin',status:'ACTIVE',assignments:[{role:'SYSTEM_ADMIN',tier:0,scope:'SYSTEM'}]},
 {id:'USR-EXEC',username:'executive',displayName:'Executive Demo',status:'ACTIVE',assignments:[{role:'VICE_RECTOR',tier:1,scope:'UNIVERSITY'}]},
 {id:'USR-MGR',username:'manager',displayName:'Manager Demo',status:'ACTIVE',assignments:[{role:'DEPARTMENT_HEAD',tier:2,scope:'DEPT-DEMO'}]},
 {id:'USR-RES',username:'researcher',displayName:'Researcher Demo',status:'ACTIVE',assignments:[{role:'RESEARCHER',tier:3,scope:'PROJECT-DEMO'}]}
];
export class IdentityBox extends RegistryBox{constructor(){super('anu2.users',seedUsers)}}
