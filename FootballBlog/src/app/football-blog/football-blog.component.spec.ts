import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootballBlogComponent } from './football-blog.component';

describe('FootballBlogComponent', () => {
  let component: FootballBlogComponent;
  let fixture: ComponentFixture<FootballBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FootballBlogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FootballBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
