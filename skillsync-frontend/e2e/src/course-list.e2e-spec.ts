import { browser, by, element } from 'protractor';

describe('Course List', () => {
  beforeEach(() => {
    browser.get('/courses');
  });

  it('should display the course list', async () => {
    const courseList = element(by.css('.course-list'));
    expect(await courseList.isPresent()).toBe(true);
  });

  it('should display course cards', async () => {
    const courseCards = element.all(by.css('.course-card'));
    expect(await courseCards.count()).toBeGreaterThan(0);
  });

  // Add more e2e tests...
});