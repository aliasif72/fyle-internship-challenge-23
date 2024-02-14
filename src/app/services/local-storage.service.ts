import { Injectable } from '@angular/core';

type repoType = Record<string,{ repoName: string; description: string; languages: string[] }[]>;
type userType = Record<string,{username: string; url: string; bio: string; location: string; totalRepos: number;}>;
export type cachedData = {
  repos: repoType;
  repoShow: repoType;
  userData: userType;
  profileName: string;
  product: number;
  pageNo: number;
  pageSize: number;
};

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  getCachedData(key: string) {
    const userRepos: string | null = localStorage.getItem(`${key}`);
    if (userRepos) {
      const ret=JSON.parse(userRepos)
      return ret;
    }
  } 

  setCachedData(key: string, datatobeCached: cachedData) {
    localStorage.setItem(`${key}`, JSON.stringify(datatobeCached));
  }
}
