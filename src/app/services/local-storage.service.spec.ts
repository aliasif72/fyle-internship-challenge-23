// import { TestBed } from '@angular/core/testing';

// import { LocalStorageService } from './local-storage.service';

// describe('LocalStorageService', () => {
//   let service: LocalStorageService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(LocalStorageService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });

import { TestBed } from '@angular/core/testing';
import { LocalStorageService, cachedData } from './local-storage.service';

describe('LocalStorageService', () => {
  let localStorageService: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService],
    });

    localStorageService = TestBed.inject(LocalStorageService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should retrieve cached data from localStorage', () => {
    const key = 'testKey';
    const testData: cachedData = {
      repos: { exampleRepoType: [{ repoName: 'repo1', description: 'Description 1', languages: ['JavaScript'] }] },
      repoShow: { exampleRepoShowType:[{ repoName: 'repo1', description: 'Description 1', languages: ['JavaScript'] }]},
      userData: { exampleUserType: { username: 'testUser', url: 'http://example.com', bio: 'Sample bio', location: 'Sample location', totalRepos: 5 } },
      profileName: 'testProfile',
      product: 42,
      pageNo: 1,
      pageSize: 10,
    };
    const testDataString = JSON.stringify(testData);

    spyOn(localStorage, 'getItem').and.returnValue(testDataString);

    const result = localStorageService.getCachedData(key);

    expect(localStorage.getItem).toHaveBeenCalledWith(`${key}`);
    expect(result).toEqual(testData);
  });

  it('should set data to localStorage', () => {
    const key = 'testKey';
    const testData: cachedData = {
      repos: {},
      repoShow: {},
      userData: {},
      profileName: 'testProfile',
      product: 42,
      pageNo: 1,
      pageSize: 10,
    };

    spyOn(localStorage, 'setItem');

    localStorageService.setCachedData(key, testData);

    expect(localStorage.setItem).toHaveBeenCalledWith(`${key}`, JSON.stringify(testData));
  });
});
