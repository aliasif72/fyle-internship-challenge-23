import { TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiService, IUser } from './api.service';
import { throwError } from 'rxjs';

export interface ErrorDetails {
  status: number;
  statusText: string;
}

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService, HttpClient],
    });

    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve user data from API', (done) => {
    const mockUserData = {
      name: 'john_doe',
      html_url: 'http://example.com',
      bio: 'Sample bio',
      location: 'Sample location',
      public_repos: 5,
    };

    service.getUser('john_doe').subscribe((user) => {
      expect(user).toEqual(mockUserData);
      done();
    });

    const req = httpTestingController.expectOne(
      'https://api.github.com/users/john_doe'
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockUserData);
  });

  it('should handle error when status code is 404', async () => {
    const errorMessage = 'Not Found';
    const error = { status: 404, statusText: 'Not Found' };

    spyOn(http, 'get').and.returnValue(throwError(error));
    service.getUser('https://api.github.com/users/0000000111111111').subscribe({
      next: () => {},
      error: (error) => {
        expect(error.status).toEqual(404);
        expect(error.statusText).toEqual('Not Found');
      },
    });
  });

  it('should throw error with response body when server returns error other than 404', () => {
    let body: ErrorDetails | undefined;

    service.getUser('0000000111111111').subscribe({
      next: () => {},
      error: (error: ErrorDetails) => {
        body = error;
      },
    });
    const expected: ErrorDetails = {
      status: 404,
      statusText: 'Not Found',
    };

    const testRequest = httpTestingController.expectOne(
      'https://api.github.com/users/0000000111111111'
    );
    testRequest.flush(expected, { status: 400, statusText: 'Bad Request' });

    expect(body).not.toEqual(expected);
  });

  it('should retrieve repositories from API', inject(
    [HttpTestingController],
    (httpClient: HttpTestingController) => {
      const mockReposData = [
        {
          name: 'repo1',
          description: 'Description 1',
          languages_url:
            'https://api.github.com/repos/aliasif72/axios-crash-sharp/languages',
        },
      ];

      service.getRepos('john_doe', 1, 10).subscribe((repos) => {
        expect(repos).toEqual(mockReposData);
      });

      const req = httpTestingController.expectOne(
        'https://api.github.com/users/john_doe/repos?per_page=10&page=1'
      );
      expect(req.request.method).toEqual('GET');
      req.flush(mockReposData);
    }
  ));

  it('should retrieve languages from API', (done) => {
    const mockLangsData = { JavaScript: 123, TypeScript: 456 };

    service.getLangs('john_doe', 'repo1').subscribe((langs) => {
      expect(langs).toEqual(mockLangsData);
      done();
    });

    const req = httpTestingController.expectOne(
      'https://api.github.com/repos/john_doe/repo1/languages'
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockLangsData);
  });
});
