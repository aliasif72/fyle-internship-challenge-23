import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

export interface IUser {
  name: string;
  html_url: string;
  bio: string;
  location: string;
  public_repos: number;
}

export interface IRepo {
  name: string;
  description: string;
  languages_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  getUser(githubUsername: string): Observable<IUser> {
    return this.httpClient.get(
      `https://api.github.com/users/${githubUsername}`
    ) as Observable<IUser>;
  }

  getRepos(
    githubUsername: string,
    page: number,
    pageSize: number
  ): Observable<Array<IRepo>> {
    return this.httpClient.get(
      `https://api.github.com/users/${githubUsername}/repos?per_page=${pageSize}&page=${page}`
    ) as Observable<Array<IRepo>>;
  }

  getLangs(
    githubUsername: string,
    repoName: string
  ): Observable<{ [key: string]: number }> {
    return this.httpClient.get(
      `https://api.github.com/repos/${githubUsername}/${repoName}/languages`
    ) as Observable<{ [key: string]: number }>;
    // implement getRepos method by referring to the documentation. Add proper types for the return type and params
  }
}
