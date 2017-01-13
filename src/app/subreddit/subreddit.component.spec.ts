/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SubredditComponent } from './subreddit.component';

describe('SubredditComponent', () => {
  let component: SubredditComponent;
  let fixture: ComponentFixture<SubredditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubredditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubredditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
