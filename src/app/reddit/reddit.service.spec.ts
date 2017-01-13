/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RedditService } from './reddit.service';

describe('RedditService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedditService]
    });
  });

  it('should ...', inject([RedditService], (service: RedditService) => {
    expect(service).toBeTruthy();
  }));
});
